import type { Lichen } from "../palette";
import type { Emitter } from "./types";

/** the displays on jass's desk. add a size, run `bun run build`. */
export const SIZES: ReadonlyArray<readonly [number, number]> = [
  [3440, 1440],
  [3024, 1964],
];

// prettier-ignore
export type Flavor =
  | "rock" | "spore" | "grid" | "rings" | "wordmark"
  | "flow" | "ridge" | "dither" | "attractor" | "maze" | "phyllo"
  | "moire" | "turing" | "branch" | "tty" | "bands";
// prettier-ignore
export const FLAVORS: readonly Flavor[] = [
  "rock", "spore", "grid", "rings", "wordmark",
  "flow", "ridge", "dither", "attractor", "maze", "phyllo",
  "moire", "turing", "branch", "tty", "bands",
];

// rock predates the set and keeps the seed it shipped with; every other
// flavor folds its name in so no two flavors share a random sequence.
function seedFor(flavor: Flavor): number {
  if (flavor === "rock") return 0;
  let h = 0;
  for (const ch of flavor) h = (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0;
  return h;
}

/**
 * every flavor draws on the same stone: base field, seeded prng keyed on
 * flavor + size (the same file always renders the same picture), the palette
 * injected as C, and a few shared shapes. the flavor body does the rest.
 */
function page(p: Lichen, flavor: Flavor, w: number, h: number, body: string): string {
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
    subtle: c("subtle"),
    accent: c("accent"),
    accentQuiet: c("accent-quiet"),
    onAccent: c("on-accent"),
  })};
// mulberry32, seeded by flavor and canvas size so each file gets its own picture
let seed=(W*73856093^H*19349663^${seedFor(flavor)})>>>0;
const rnd=()=>{seed=(seed+0x6D2B79F5)>>>0;let t=seed;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296};
const R=(a,b)=>a+rnd()*(b-a);
const TAU=Math.PI*2;
const ctx=document.getElementById("c").getContext("2d");
ctx.fillStyle=C.base;ctx.fillRect(0,0,W,H);
ctx.globalAlpha=1;
// fine grit so the field reads as stone, not a dead screen (no gradients: they band into rings on a field this dark)
function grit(per){
  const n=Math.round(W*H/per);
  for(let i=0;i<n;i++){
    ctx.fillStyle=rnd()<0.85?C.surface:C.overlay;
    ctx.globalAlpha=R(0.3,0.8);
    const x=R(0,W),y=R(0,H),s=R(0.8,2);
    ctx.fillRect(x,y,s,s);
  }
  ctx.globalAlpha=1;
}
// lobed outline: a circle whose radius wobbles with a few harmonics
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
// stateless value noise + fbm: an integer hash, no tables, so defining it
// consumes no rnd() and old flavors keep their pictures
function ih(x,y){let h=(Math.imul(x,374761393)+Math.imul(y,668265263)^${seedFor(flavor)})|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
function vnoise(x,y){
  const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;
  const sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);
  const a=ih(ix,iy),b=ih(ix+1,iy),c=ih(ix,iy+1),d=ih(ix+1,iy+1);
  return a+(b-a)*sx+(c-a)*sy+(a-b-c+d)*sx*sy;
}
function fbm(x,y){return (vnoise(x,y)+0.5*vnoise(x*2.03,y*2.03)+0.25*vnoise(x*4.01,y*4.01))/1.75}
${body}
</script></body></html>`;
}

/**
 * rock: a rock face with crustose lichen on it. grey colonies grow across the
 * dark stone; one of them is the lime. every colony is a lobed disc tiled
 * with voronoi areoles, finer toward the margin, split by base-coloured
 * cracks — the look of map lichen (Rhizocarpon geographicum).
 */
const rock = `grit(2200);

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
}`;

/**
 * spore: bare stone and one spore that just landed, where the rock colony
 * sits. the accent is a point, never an area — this is that rule as a picture.
 */
const spore = `grit(2600);
const x=W*R(0.58,0.64),y=H*R(0.42,0.48),r=S*0.008;
// a faint prothallus ring: where it will grow next
ctx.strokeStyle=C.accentQuiet;ctx.globalAlpha=0.35;ctx.lineWidth=Math.max(1,S*0.0015);
ctx.beginPath();ctx.arc(x,y,r*2.8,0,TAU);ctx.stroke();
ctx.globalAlpha=1;ctx.fillStyle=C.accent;
ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();`;

/**
 * grid: a survey lattice over the stone, the kind laid over a face to track
 * growth plot by plot. every point is a grey dot; one cell is alive.
 */
const grid = `const g=S*0.032,cols=Math.round(W/g),rows=Math.round(H/g);
const ox=(W-(cols-1)*g)/2,oy=(H-(rows-1)*g)/2;
const li=Math.round((cols-1)*R(0.58,0.64)),lj=Math.round((rows-1)*R(0.42,0.48));
const dr=Math.max(1.4,S*0.0014);
for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
  if(i===li&&j===lj)continue;
  ctx.fillStyle=rnd()<0.7?C.border:C.muted;
  ctx.globalAlpha=R(0.5,1);
  ctx.beginPath();ctx.arc(ox+i*g,oy+j*g,dr,0,TAU);ctx.fill();
}
ctx.globalAlpha=1;ctx.fillStyle=C.accent;
ctx.beginPath();ctx.arc(ox+li*g,oy+lj*g,dr*2.4,0,TAU);ctx.fill();`;

/**
 * rings: the margins of one great colony over the years, read like contour
 * lines on a map. grey rings fade with distance; the lime marks the point it
 * all grew from, and one early margin keeps a quiet lime trace.
 */
const rings = `const cx=W*R(0.60,0.66),cy=H*R(0.40,0.46);
const f=lobes();
const maxd=Math.max(Math.hypot(cx,cy),Math.hypot(W-cx,cy),Math.hypot(cx,H-cy),Math.hypot(W-cx,H-cy));
ctx.lineWidth=Math.max(1.2,S*0.0011);
let r=S*0.05,i=0;
while(r<maxd*1.05){
  const w1=R(0,TAU),a1=R(0.006,0.018);
  const shape=t=>f(t)+a1*Math.sin(11*t+w1);
  const q=r/maxd;
  if(i===2){ctx.strokeStyle=C.accentQuiet;ctx.globalAlpha=0.7}
  else{ctx.strokeStyle=q<0.3?C.border:q<0.65?C.overlay:C.surface;ctx.globalAlpha=0.95}
  outline(cx,cy,r,shape);ctx.stroke();
  r*=R(1.10,1.16);i++;
}
ctx.globalAlpha=1;ctx.fillStyle=C.accent;
ctx.beginPath();ctx.arc(cx,cy,S*0.005,0,TAU);ctx.fill();`;

/**
 * wordmark: the name, set small in the middle of the stone. the i is dotless
 * and the tittle is painted back in lime — the one point of colour.
 */
const wordmark = `grit(2600);
const fs=Math.round(S*0.042);
ctx.font="500 "+fs+"px 'JetBrains Mono',ui-monospace,Menlo,monospace";
ctx.textAlign="left";ctx.textBaseline="alphabetic";
const word="l\\u0131chen";
const cw=ctx.measureText("l").width;
const x0=(W-cw*6)/2,yb=H/2+fs*0.32;
ctx.fillStyle=C.subtle;ctx.fillText(word,x0,yb);
const xh=ctx.measureText("x").actualBoundingBoxAscent,lh=ctx.measureText("l").actualBoundingBoxAscent;
ctx.fillStyle=C.accent;
ctx.beginPath();ctx.arc(x0+cw*1.5,yb-xh-(lh-xh)*0.45,fs*0.06,0,TAU);ctx.fill();`;

/**
 * flow: a wind field over the stone. thousands of short grey trails follow
 * the same noise; the ones that pass near the golden point are lime.
 */
const flow = `grit(3200);
const Z=R(0,100),ZY=R(0,100),sc=1/(S*0.55);
const ang=(x,y)=>fbm(x*sc+Z,y*sc+ZY)*TAU*2.2;
const lx=W*0.62,ly=H*0.44,lr=S*0.30;
const gs=[C.surface,C.overlay,C.overlay,C.border,C.muted];
const trails=Math.round(W*H/900);
for(let i=0;i<trails;i++){
  let x=R(-W*0.05,W*1.05),y=R(-H*0.05,H*1.05);
  const dl=Math.hypot(x-lx,y-ly)<lr*R(0.55,1.15);
  ctx.strokeStyle=dl?(rnd()<0.75?C.accent:C.accentQuiet):gs[Math.floor(rnd()*gs.length)];
  ctx.globalAlpha=dl?R(0.25,0.6):R(0.2,0.55);
  ctx.lineWidth=R(0.6,1.4);
  ctx.beginPath();ctx.moveTo(x,y);
  const n=Math.round(R(20,60)),st=S*0.004;
  for(let k=0;k<n;k++){const a=ang(x,y);x+=Math.cos(a)*st;y+=Math.sin(a)*st;ctx.lineTo(x,y)}
  ctx.stroke();
}
ctx.globalAlpha=1;`;

/**
 * ridge: stacked ridgelines with a central massif, each line occluding the
 * one behind it — the unknown pleasures move, but it's a mountain of stone
 * and one contour runs lime.
 */
const ridge = `const rows=44,x0=W*0.30,x1=W*0.70,y0=H*0.26,y1=H*0.80,pts=150,Z=R(0,100);
const limeRow=Math.round(rows*0.62);
ctx.lineWidth=Math.max(1.2,S*0.0012);ctx.lineJoin="round";
for(let j=0;j<rows;j++){
  const y=y0+(y1-y0)*j/(rows-1),line=[];
  for(let i=0;i<=pts;i++){
    const t=i/pts,x=x0+(x1-x0)*t;
    const env=Math.exp(-Math.pow((t-0.5)/0.16,2));
    const n=Math.pow(fbm(t*7+Z,j*0.35+Z),3)*2.2*S*0.12+vnoise(t*40+Z,j*2.1)*S*0.012;
    line.push([x,y-env*n-fbm(t*3,j)*S*0.008]);
  }
  ctx.beginPath();ctx.moveTo(x0,y+2);line.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(x1,y+2);ctx.closePath();
  ctx.fillStyle=C.base;ctx.fill();
  ctx.beginPath();line.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
  ctx.strokeStyle=j===limeRow?C.accent:(j%4===0?C.subtle:C.muted);
  ctx.globalAlpha=j===limeRow?1:0.9;
  ctx.stroke();
}
ctx.globalAlpha=1;`;

/**
 * dither: two glows printed in ordered bayer dither, the old-bitmap way —
 * a lime one at the golden point, a grey one rising from the far corner.
 */
const dither = `const B=[[0,32,8,40,2,34,10,42],[48,16,56,24,50,18,58,26],[12,44,4,36,14,46,6,38],[60,28,52,20,62,30,54,22],[3,35,11,43,1,33,9,41],[51,19,59,27,49,17,57,25],[15,47,7,39,13,45,5,37],[63,31,55,23,61,29,53,21]];
const px=Math.max(4,Math.round(S*0.004)),d=px*0.55;
const gx=W*0.63,gy=H*0.42,gr=S*0.52;
const hx=W*0.08,hy=H*0.95,hr=S*0.85;
for(let y=0,j=0;y<H;y+=px,j++)for(let x=0,i=0;x<W;x+=px,i++){
  const t=(B[j%8][i%8]+0.5)/64;
  const I1=Math.pow(Math.max(0,1-Math.hypot(x-gx,y-gy)/gr),2);
  const I2=Math.pow(Math.max(0,1-Math.hypot(x-hx,y-hy)/hr),2)*0.85;
  if(I1>t){ctx.fillStyle=C.accent;ctx.fillRect(x,y,d,d)}
  else if(I2>t){ctx.fillStyle=C.overlay;ctx.fillRect(x,y,d,d)}
}`;

/**
 * attractor: a de jong map, four hundred thousand points of lime light with
 * a faint grey echo behind it. density does the shading.
 */
const attractor = `grit(3600);
// fixed params: perturbing them can drop the orbit into a periodic window
// and collapse the cloud to a few hundred pixels (found out the hard way)
const pa=1.4,pb=-2.3,pc=2.4,pd=-2.1;
const sc=S*0.20,cx=W*0.5,cy=H*0.485;
// accumulate a density histogram, then tone-map it: log density from quiet
// lime up to the full accent, so the orbit's folds glow where they pile up
const hist=new Float32Array(W*H);
let x=R(-1,1),y=R(-1,1);
for(let i=0;i<4000000;i++){
  const nx=Math.sin(pa*y)-Math.cos(pb*x),ny=Math.sin(pc*x)-Math.cos(pd*y);
  x=nx;y=ny;
  if(i>20){
    const ix=(cx+x*sc)|0,iy=(cy+y*sc)|0;
    if(ix>=0&&iy>=0&&ix<W&&iy<H)hist[iy*W+ix]++;
  }
}
function rgb(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
const A=rgb(C.accent),Q=rgb(C.accentQuiet);
let max=0;for(let i=0;i<hist.length;i++)if(hist[i]>max)max=hist[i];
const lm=Math.log(1+max);
const img=ctx.getImageData(0,0,W,H),d=img.data;
for(let i=0;i<hist.length;i++){
  const h=hist[i];if(!h)continue;
  const t=Math.log(1+h)/lm;
  const m=Math.min(1,t*1.5),a=Math.min(1,0.2+t*1.6);
  const r=Q[0]+(A[0]-Q[0])*m,g=Q[1]+(A[1]-Q[1])*m,b=Q[2]+(A[2]-Q[2])*m;
  const j=i*4;
  d[j]+=(r-d[j])*a;d[j+1]+=(g-d[j+1])*a;d[j+2]+=(b-d[j+2])*a;
}
ctx.putImageData(img,0,0);`;

/**
 * maze: 10 PRINT, colonised. diagonals all the way down; inside one lobed
 * blob the maze has been overgrown in lime.
 */
const maze = `const g=Math.max(18,Math.round(S*0.02));
const f=lobes(),bx=W*0.62,by=H*0.44,br=S*0.28;
ctx.lineCap="round";
for(let y=0;y<H;y+=g)for(let x=0;x<W;x+=g){
  const mx=x+g/2,my=y+g/2;
  const q=Math.hypot(mx-bx,my-by)/(br*f(Math.atan2(my-by,mx-bx)));
  if(q<1){ctx.strokeStyle=rnd()<(1-q)?C.accent:C.accentQuiet;ctx.globalAlpha=R(0.6,1)}
  else{ctx.strokeStyle=rnd()<0.8?C.overlay:C.border;ctx.globalAlpha=R(0.4,0.9)}
  ctx.lineWidth=Math.max(1.5,g*0.09);
  ctx.beginPath();
  if(rnd()<0.5){ctx.moveTo(x,y);ctx.lineTo(x+g,y+g)}else{ctx.moveTo(x+g,y);ctx.lineTo(x,y+g)}
  ctx.stroke();
}
ctx.globalAlpha=1;`;

/**
 * phyllo: phyllotaxis — every dot at the golden angle from the last. the
 * field is grey; two fibonacci parastichies (every 34th and 55th dot) trace
 * lime spirals through it.
 */
const phyllo = `const cx=W*0.62,cy=H*0.44,ga=Math.PI*(3-Math.sqrt(5)),cs=S*0.012;
const reach=Math.hypot(Math.max(cx,W-cx),Math.max(cy,H-cy));
const n=Math.round(Math.pow(reach/cs,2))+50;
for(let i=1;i<n;i++){
  const r=cs*Math.sqrt(i),t=i*ga;
  const x=cx+Math.cos(t)*r,y=cy+Math.sin(t)*r;
  if(x<-10||y<-10||x>W+10||y>H+10)continue;
  const dot=Math.min(S*0.005,Math.max(S*0.0016,r*0.006));
  ctx.fillStyle=rnd()<0.7?C.border:C.overlay;
  ctx.globalAlpha=R(0.5,0.95);
  ctx.beginPath();ctx.arc(x,y,dot,0,TAU);ctx.fill();
}
// two golden spirals of lime growing out of the same heart
function spiral(phase,col,am){
  let th=0,r=cs*1.4,acc=1e9;
  ctx.fillStyle=col;
  while(r<reach){
    if(acc>cs*1.15){
      const x=cx+Math.cos(th+phase)*r,y=cy+Math.sin(th+phase)*r;
      if(x>-10&&y>-10&&x<W+10&&y<H+10){
        ctx.globalAlpha=am*R(0.85,1);
        ctx.beginPath();ctx.arc(x,y,Math.min(S*0.006,Math.max(S*0.002,r*0.007)),0,TAU);ctx.fill();
      }
      acc=0;
    }
    const dth=0.02,nr=cs*1.4*Math.exp(0.3063*(th+dth));
    acc+=Math.hypot(nr-r,r*dth);th+=dth;r=nr;
  }
}
spiral(0,C.accent,1);
spiral(Math.PI,C.accentQuiet,0.85);
ctx.globalAlpha=1;`;

/**
 * moire: two ring fields with slightly different spacing beating against
 * each other — one grey, one quiet lime. duotone interference.
 */
const moire = `const sp=Math.max(10,S*0.011),maxr=Math.hypot(W,H);
const ax=W*0.44,ay=H*0.54,bx=W*0.60,by=H*0.42;
ctx.lineWidth=Math.max(1.5,sp*0.24);
ctx.strokeStyle=C.border;ctx.globalAlpha=0.8;
for(let r=sp;r<maxr;r+=sp){ctx.beginPath();ctx.arc(ax,ay,r,0,TAU);ctx.stroke()}
ctx.strokeStyle=C.accentQuiet;ctx.globalAlpha=0.3;
for(let r=sp;r<maxr;r+=sp*1.03){ctx.beginPath();ctx.arc(bx,by,r,0,TAU);ctx.stroke()}
ctx.globalAlpha=1;
ctx.fillStyle=C.muted;ctx.beginPath();ctx.arc(ax,ay,sp*0.45,0,TAU);ctx.fill();
ctx.fillStyle=C.accent;ctx.beginPath();ctx.arc(bx,by,sp*0.45,0,TAU);ctx.fill();`;

/**
 * turing: gray-scott reaction-diffusion — the mathematics of how growth
 * decides where to go. the pattern is grey stone; where it crosses one lobed
 * region it is alive and lime.
 */
const turing = `const px=9,gw=Math.ceil(W/px),gh=Math.ceil(H/px),N=gw*gh;
const u=new Float32Array(N).fill(1),v=new Float32Array(N),u2=new Float32Array(N),v2=new Float32Array(N);
for(let s=0;s<16;s++){
  const sx=Math.floor(R(2,gw-2)),sy=Math.floor(R(2,gh-2));
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const i=sx+dx+(sy+dy)*gw;v[i]=0.9;u[i]=0.4}
}
const F=0.0545,K=0.062;
for(let s=0;s<850;s++){
  for(let y=0;y<gh;y++){
    const ym=(y+gh-1)%gh,yp=(y+1)%gh;
    for(let x=0;x<gw;x++){
      const xm=(x+gw-1)%gw,xp=(x+1)%gw,i=x+y*gw;
      const lu=0.2*(u[xm+y*gw]+u[xp+y*gw]+u[x+ym*gw]+u[x+yp*gw])+0.05*(u[xm+ym*gw]+u[xp+ym*gw]+u[xm+yp*gw]+u[xp+yp*gw])-u[i];
      const lv=0.2*(v[xm+y*gw]+v[xp+y*gw]+v[x+ym*gw]+v[x+yp*gw])+0.05*(v[xm+ym*gw]+v[xp+ym*gw]+v[xm+yp*gw]+v[xp+yp*gw])-v[i];
      const uvv=u[i]*v[i]*v[i];
      u2[i]=u[i]+(lu-uvv+F*(1-u[i]));
      v2[i]=v[i]+(0.5*lv+uvv-(F+K)*v[i]);
    }
  }
  u.set(u2);v.set(v2);
}
const f=lobes(),bx=W*0.62,by=H*0.44,br=S*0.30;
for(let y=0;y<gh;y++)for(let x=0;x<gw;x++){
  const val=v[x+y*gw];if(val<0.1)continue;
  const cx=x*px+px/2,cy=y*px+px/2;
  const q=Math.hypot(cx-bx,cy-by)/(br*f(Math.atan2(cy-by,cx-bx)));
  ctx.fillStyle=q<1?C.accent:(q<1.18?C.accentQuiet:C.border);
  ctx.globalAlpha=Math.min(1,(val-0.1)*5)*(q<1?0.95:0.85);
  ctx.beginPath();ctx.arc(cx,cy,px*0.62,0,TAU);ctx.fill();
}
ctx.globalAlpha=1;`;

/**
 * branch: the fruticose kind — shrubby thalli growing up from the bottom
 * edge, grey wood, and the bushes near the golden point fruit in lime.
 */
const branch = `grit(3200);
ctx.lineCap="round";
function bush(x,y,ang,len,wid,depth,limey){
  if(depth===0||len<S*0.004){
    if(limey){ctx.fillStyle=rnd()<0.7?C.accent:C.accentQuiet;ctx.globalAlpha=R(0.7,1);ctx.beginPath();ctx.arc(x,y,Math.max(2,wid*2.2),0,TAU);ctx.fill();ctx.globalAlpha=1}
    return;
  }
  const x2=x+Math.cos(ang)*len,y2=y+Math.sin(ang)*len;
  ctx.strokeStyle=depth>=6?C.border:(depth>=3?C.muted:C.subtle);
  ctx.lineWidth=Math.max(1,wid);
  const mx=(x+x2)/2+Math.cos(ang+Math.PI/2)*len*R(-0.12,0.12),my=(y+y2)/2+Math.sin(ang+Math.PI/2)*len*R(-0.12,0.12);
  ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(mx,my,x2,y2);ctx.stroke();
  const nb=rnd()<0.85?2:3;
  for(let i=0;i<nb;i++)bush(x2,y2,ang+R(-0.55,0.55),len*R(0.62,0.8),wid*0.72,depth-1,limey);
}
const bushes=Math.max(7,Math.round(9*W/3440));
for(let i=0;i<bushes;i++){
  const bx=W*(0.04+0.92*i/(bushes-1))+R(-W*0.03,W*0.03);
  const sc=R(0.8,1.6),limey=Math.abs(bx-W*0.62)<W*0.09;
  bush(bx,H+5,-Math.PI/2+R(-0.15,0.15),S*0.12*sc,S*0.007*sc,9,limey);
}`;

/**
 * tty: a quiet buffer of dim hex, and one live prompt at the golden point —
 * the prompt char in lime, like the p10k port draws it.
 */
const tty = `grit(3600);
const fs=Math.round(S*0.013);
ctx.font=fs+"px 'JetBrains Mono',ui-monospace,Menlo,monospace";
const mw=ctx.measureText("0").width,pw=mw*2,lh=fs*2.2;
const cols=Math.floor(W/pw),rows=Math.floor(H/lh);
const chars="0123456789abcdef";
for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
  if(rnd()>0.16)continue;
  ctx.fillStyle=rnd()<0.8?C.overlay:C.border;
  ctx.globalAlpha=R(0.5,1);
  ctx.fillText(chars[Math.floor(rnd()*16)],(i+0.5)*pw,(j+0.75)*lh);
}
ctx.globalAlpha=1;
const pxx=(Math.round(cols*0.55)+0.5)*pw,pyy=(Math.round(rows*0.44)+0.75)*lh;
ctx.fillStyle=C.base;ctx.fillRect(pxx-mw,pyy-fs*1.4,mw*13,fs*2);
ctx.fillStyle=C.accent;ctx.fillText("\\u276F",pxx,pyy);
ctx.fillStyle=C.subtle;ctx.fillText("lichen",pxx+mw*2,pyy);
ctx.fillStyle=C.accent;ctx.globalAlpha=0.9;ctx.fillRect(pxx+mw*9,pyy-fs*0.85,mw*0.9,fs*1.1);
ctx.globalAlpha=1;`;

/**
 * bands: a duotone print — diagonal bands of the grey ramp in random widths,
 * struck through by one lime line and one quiet echo.
 */
const bands = `ctx.translate(W/2,H/2);ctx.rotate(-0.35);
const L=Math.hypot(W,H);
let x=-L/2;
while(x<L/2){
  const w=S*Math.pow(rnd(),1.6)*0.16+S*0.012;
  const p=rnd();
  ctx.fillStyle=p<0.42?C.base:p<0.72?C.surface:p<0.92?C.overlay:C.border;
  ctx.fillRect(x,-L/2,w+1,L);
  x+=w;
}
ctx.fillStyle=C.accent;ctx.fillRect(L*R(0.08,0.14),-L/2,Math.max(3,S*0.005),L);
ctx.fillStyle=C.accentQuiet;ctx.globalAlpha=0.8;ctx.fillRect(-L*R(0.20,0.28),-L/2,Math.max(5,S*0.010),L);
ctx.globalAlpha=1;ctx.setTransform(1,0,0,1,0,0);`;

// prettier-ignore
const bodies: Record<Flavor, string> = {
  rock, spore, grid, rings, wordmark,
  flow, ridge, dither, attractor, maze, phyllo, moire, turing, branch, tty, bands,
};

// flavors that compute for a while get a longer settle before the screenshot
const waits: Partial<Record<Flavor, number>> = {
  turing: 16000, attractor: 8000, flow: 2500, dither: 1500, phyllo: 2000, moire: 1500,
};

export function wallpaperHtml(p: Lichen, flavor: Flavor, w: number, h: number): string {
  return page(p, flavor, w, h, bodies[flavor]);
}

async function screenshot(p: Lichen, flavor: Flavor, w: number, h: number): Promise<Uint8Array> {
  await using view = new Bun.WebView({ width: w, height: h });
  await view.navigate("data:text/html;charset=utf-8," + encodeURIComponent(wallpaperHtml(p, flavor, w, h)));
  await Bun.sleep(waits[flavor] ?? 800);
  const png = await view.screenshot({ encoding: "buffer", format: "png" });
  return new Uint8Array(png);
}

export const wallpaper: Emitter[] = FLAVORS.flatMap((flavor) =>
  SIZES.map(([w, h]) => ({
    path: `ports/wallpaper/lichen-${flavor}-${w}x${h}.png`,
    render: (p: Lichen) => screenshot(p, flavor, w, h),
    check: false,
  })),
);
