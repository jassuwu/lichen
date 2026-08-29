import type { Lichen } from "../palette";
import type { Emitter } from "./types";

/** the displays on jass's desk. add a size, run `bun run build`. */
export const SIZES: ReadonlyArray<readonly [number, number]> = [
  [3440, 1440],
  [3024, 1964],
];

/**
 * a rock face with crustose lichen on it. grey colonies grow across the dark
 * stone; one of them is the lime. every colony is a lobed disc with growth
 * rings and apothecia (the little fruiting dots), placed by a seeded prng so
 * the same size always renders the same picture.
 */
export function wallpaperHtml(p: Lichen, w: number, h: number): string {
  const c = (role: Parameters<Lichen["hex"]>[0]) => p.hex(role);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:${w}px;height:${h}px;background:${c("base")};overflow:hidden}
canvas{display:block}
</style></head><body><canvas id="c" width="${w}" height="${h}"></canvas><script>
const W=${w},H=${h},S=Math.min(W,H);
const C=${JSON.stringify({
    base: c("base"),
    surface: c("surface"),
    overlay: c("overlay"),
    border: c("border"),
    muted: c("muted"),
    accent: c("accent"),
    accentQuiet: c("accent-quiet"),
    onAccent: c("on-accent"),
  })};
// mulberry32, seeded by the canvas size so each display gets its own rock
let seed=(W*73856093^H*19349663)>>>0;
const rnd=()=>{seed=(seed+0x6D2B79F5)>>>0;let t=seed;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296};
const R=(a,b)=>a+rnd()*(b-a);
const TAU=Math.PI*2;
const ctx=document.getElementById("c").getContext("2d");

// --- rock: base with a fine grit (no gradients: they band into rings on a field this dark)
ctx.fillStyle=C.base;ctx.fillRect(0,0,W,H);
ctx.globalAlpha=1;
const grit=Math.round(W*H/2200);
for(let i=0;i<grit;i++){
  ctx.fillStyle=rnd()<0.85?C.surface:C.overlay;
  ctx.globalAlpha=R(0.3,0.8);
  const x=R(0,W),y=R(0,H),s=R(0.8,2);
  ctx.fillRect(x,y,s,s);
}
ctx.globalAlpha=1;

// --- lobed outline: a circle whose radius wobbles with a few harmonics
function lobes(){
  const k=[R(0,TAU),R(0,TAU),R(0,TAU),R(0,TAU)];
  const a=[R(0.06,0.14),R(0.04,0.09),R(0.02,0.05),R(0.01,0.03)];
  return t=>1+a[0]*Math.sin(3*t+k[0])+a[1]*Math.sin(7*t+k[1])+a[2]*Math.sin(13*t+k[2])+a[3]*Math.sin(23*t+k[3]);
}
function outline(x,y,r,f){
  ctx.beginPath();
  const n=Math.max(64,Math.round(r));
  for(let i=0;i<=n;i++){const t=i/n*TAU,rr=r*f(t);const px=x+Math.cos(t)*rr,py=y+Math.sin(t)*rr;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}
  ctx.closePath();
}

// --- areoles: voronoi cells over a jittered polar grid, finer toward the margin
function clipHalf(poly,ax,ay,bx,by){
  // keep the side of the perpendicular bisector of a-b that contains a
  const mx=(ax+bx)/2,my=(ay+by)/2,nx=bx-ax,ny=by-ay;
  const inside=p=>(p[0]-mx)*nx+(p[1]-my)*ny<=0;
  const out=[];
  for(let i=0;i<poly.length;i++){
    const p=poly[i],q=poly[(i+1)%poly.length],ip=inside(p),iq=inside(q);
    if(ip)out.push(p);
    if(ip!==iq){
      const dp=(p[0]-mx)*nx+(p[1]-my)*ny,dq=(q[0]-mx)*nx+(q[1]-my)*ny,t=dp/(dp-dq);
      out.push([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t]);
    }
  }
  return out;
}
function areoles(x,y,r,f){
  const pts=[];
  const cell=Math.max(r*0.16,S*0.011);
  pts.push([x+R(-cell*0.3,cell*0.3),y+R(-cell*0.3,cell*0.3),1]);
  for(let d=cell;d<r*1.2;d+=cell*(0.55+0.45*(1-d/r))){
    const n=Math.max(4,Math.round(TAU*d/(cell*(0.55+0.45*(1-d/r)))));
    const off=R(0,TAU);
    for(let i=0;i<n;i++){
      const t=off+i/n*TAU+R(-0.3,0.3)/n*TAU,dd=d*R(0.92,1.08);
      pts.push([x+Math.cos(t)*dd,y+Math.sin(t)*dd,dd/(r*f(t))]);
    }
  }
  const cells=[];
  const reach=cell*2.6;
  for(const p of pts){
    if(p[2]>1.05)continue; // seeds outside the thallus only shape their neighbours
    let poly=[[p[0]-reach,p[1]-reach],[p[0]+reach,p[1]-reach],[p[0]+reach,p[1]+reach],[p[0]-reach,p[1]+reach]];
    for(const q of pts){
      if(q===p)continue;
      if(Math.abs(q[0]-p[0])>reach||Math.abs(q[1]-p[1])>reach)continue;
      poly=clipHalf(poly,p[0],p[1],q[0],q[1]);
      if(poly.length<3)break;
    }
    if(poly.length>=3)cells.push(poly);
  }
  return cells;
}
function colony(x,y,r,tile,gap,rim,alphaLo,alphaHi){
  const f=lobes();
  ctx.save();
  outline(x,y,r,f);ctx.clip();
  ctx.fillStyle=gap;ctx.fillRect(x-r*1.3,y-r*1.3,r*2.6,r*2.6);
  const cells=areoles(x,y,r,f);
  ctx.lineJoin="round";
  for(const poly of cells){
    ctx.beginPath();poly.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    ctx.globalAlpha=R(alphaLo,alphaHi);ctx.fillStyle=tile;ctx.fill();
    ctx.globalAlpha=1;ctx.strokeStyle=gap;ctx.lineWidth=Math.max(1.2,r*0.014);ctx.stroke();
  }
  ctx.restore();
  // prothallus: the dark margin where it is still growing
  outline(x,y,r,f);ctx.strokeStyle=rim;ctx.lineWidth=Math.max(1.5,r*0.02);ctx.globalAlpha=0.9;ctx.stroke();
  ctx.globalAlpha=1;
  return f;
}

// --- placement: colonies cluster like they do on a real face, no overlaps
const placed=[];
function free(x,y,r){return placed.every(q=>Math.hypot(q.x-x,q.y-y)>(q.r+r)*1.06)}
function place(r,cx,cy,spread){
  for(let tries=0;tries<300;tries++){
    const t=R(0,TAU),d=Math.abs(R(-1,1)+R(-1,1))*spread;
    const x=cx+Math.cos(t)*d,y=cy+Math.sin(t)*d;
    if(x<r*0.5||y<r*0.5||x>W-r*0.5||y>H-r*0.5)continue;
    if(free(x,y,r)){placed.push({x,y,r});return [x,y]}
  }
  return null;
}
// the lime first, a little right of centre and a little above, so it owns its spot
const limeR=S*0.12;
const lime=[W*R(0.58,0.64),H*R(0.42,0.48)];
placed.push({x:lime[0],y:lime[1],r:limeR});
// grey clusters elsewhere
const clusters=[[W*0.18,H*0.3],[W*0.22,H*0.78],[W*0.85,H*0.25],[W*0.8,H*0.8],[W*0.5,H*0.85]];
const count=Math.round(16*(W*H)/(3440*1440));
const sizes=[];for(let i=0;i<count;i++)sizes.push(S*Math.pow(rnd(),1.6)*0.13+S*0.02);
sizes.sort((a,b)=>b-a);
const greys=[[C.overlay,C.base,C.surface,0.6,1],[C.border,C.base,C.overlay,0.5,0.9],[C.surface,C.base,C.surface,0.8,1]];
for(const r of sizes){
  const k=clusters[Math.floor(rnd()*clusters.length)];
  const at=place(r,k[0],k[1],S*0.45);if(!at)continue;
  const g=greys[Math.floor(rnd()*greys.length)];
  colony(at[0],at[1],r,g[0],g[1],g[2],g[3],g[4]);
}
colony(lime[0],lime[1],limeR,C.accent,C.base,C.accentQuiet,0.7,1);
// a few satellites: spores that took
for(let i=0;i<6;i++){
  const t=R(0,TAU),d=R(limeR*1.3,limeR*2.2),r=R(limeR*0.06,limeR*0.18);
  const x=lime[0]+Math.cos(t)*d,y=lime[1]+Math.sin(t)*d;
  if(!free(x,y,r))continue;
  placed.push({x,y,r});
  colony(x,y,r,C.accent,C.base,C.accentQuiet,0.7,1);
}
</script></body></html>`;
}

async function screenshot(p: Lichen, w: number, h: number): Promise<Uint8Array> {
  await using view = new Bun.WebView({ width: w, height: h });
  await view.navigate("data:text/html;charset=utf-8," + encodeURIComponent(wallpaperHtml(p, w, h)));
  await Bun.sleep(300);
  const png = await view.screenshot({ encoding: "buffer", format: "png" });
  return new Uint8Array(png);
}

export const wallpaper: Emitter[] = SIZES.map(([w, h]) => ({
  path: `ports/wallpaper/lichen-${w}x${h}.png`,
  render: (p) => screenshot(p, w, h),
  check: false,
}));
