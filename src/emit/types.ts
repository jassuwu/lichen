import type { Lichen } from "../palette";

export type Rendered = string | Uint8Array;

export interface Emitter {
  /** path relative to the repo root */
  path: string;
  render(p: Lichen): Rendered | Promise<Rendered>;
  /** false = build writes it but `--check` does not compare it (non-deterministic bytes) */
  check?: boolean;
}
