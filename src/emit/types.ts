import type { Lichen } from "../palette";

export interface Emitter {
  path: string;
  render(p: Lichen): string | Uint8Array;
}
