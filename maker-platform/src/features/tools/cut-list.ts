/**
 * Cut list tools.
 *
 * 1) summarizeCutList — a plain CUT LIST: counts parts and board feet.
 *    It does not decide where parts come from.
 * 2) estimateLinearStock — a simple 1D ESTIMATE using first-fit decreasing
 *    (FFD) on board length, with kerf. It assumes one part across the width
 *    of each board (no ripping several parts side by side), ignores grain,
 *    defects and end checks. It is a heuristic, not an optimal nesting
 *    algorithm, and not a substitute for laying out real boards.
 */
import { CUBIC_INCHES_PER_BF, InputError } from "./board-foot";

export interface CutPart {
  id: string;
  name: string;
  quantity: number;
  /** Inches. */
  length: number;
  width: number;
  thickness: number;
}

export interface CutListSummary {
  pieces: number;
  boardFeet: number;
  byThickness: { thickness: number; pieces: number; boardFeet: number }[];
}

export function validatePart(p: CutPart) {
  if (!p.name.trim()) throw new InputError("Every part needs a name.");
  if (!Number.isInteger(p.quantity) || p.quantity < 1) throw new InputError(`“${p.name}”: quantity must be a whole number ≥ 1.`);
  for (const [k, v] of [["length", p.length], ["width", p.width], ["thickness", p.thickness]] as const) {
    if (!Number.isFinite(v) || v <= 0) throw new InputError(`“${p.name}”: ${k} must be greater than zero.`);
  }
}

export function summarizeCutList(parts: CutPart[]): CutListSummary {
  parts.forEach(validatePart);
  const map = new Map<number, { pieces: number; boardFeet: number }>();
  let pieces = 0;
  let bf = 0;
  for (const p of parts) {
    const each = (p.length * p.width * p.thickness) / CUBIC_INCHES_PER_BF;
    pieces += p.quantity;
    bf += each * p.quantity;
    const g = map.get(p.thickness) ?? { pieces: 0, boardFeet: 0 };
    g.pieces += p.quantity;
    g.boardFeet += each * p.quantity;
    map.set(p.thickness, g);
  }
  return {
    pieces,
    boardFeet: bf,
    byThickness: [...map.entries()].sort((a, b) => a[0] - b[0]).map(([thickness, v]) => ({ thickness, ...v })),
  };
}

export interface StockOptions {
  /** Stock board length in inches (e.g. 96 for 8 ft). */
  stockLength: number;
  /** Stock board width in inches. Parts wider than this are reported. */
  stockWidth: number;
  /** Saw kerf in inches (e.g. 0.125). */
  kerf: number;
}

export interface StockBoard {
  cuts: { name: string; length: number }[];
  used: number;
  offcut: number;
}

export interface StockEstimate {
  boards: StockBoard[];
  /** Parts that cannot fit the stock as entered. */
  oversize: { name: string; reason: string }[];
  yieldPercent: number;
}

export function estimateLinearStock(parts: CutPart[], opts: StockOptions): StockEstimate {
  parts.forEach(validatePart);
  if (!(opts.stockLength > 0) || !(opts.stockWidth > 0)) throw new InputError("Stock length and width must be greater than zero.");
  if (!(opts.kerf >= 0) || opts.kerf > 1) throw new InputError("Kerf must be between 0 and 1 inch.");

  const oversize: StockEstimate["oversize"] = [];
  const pieces: { name: string; length: number }[] = [];
  for (const p of parts) {
    if (p.length > opts.stockLength) {
      oversize.push({ name: p.name, reason: `longer than the ${opts.stockLength}″ stock` });
      continue;
    }
    if (p.width > opts.stockWidth) {
      oversize.push({ name: p.name, reason: `wider than the ${opts.stockWidth}″ stock — needs a glue-up` });
      continue;
    }
    for (let i = 0; i < p.quantity; i++) pieces.push({ name: p.name, length: p.length });
  }
  pieces.sort((a, b) => b.length - a.length);

  const boards: StockBoard[] = [];
  for (const piece of pieces) {
    const need = (b: StockBoard) => piece.length + (b.cuts.length ? opts.kerf : 0);
    let target = boards.find((b) => b.used + need(b) <= opts.stockLength + 1e-9);
    if (!target) {
      target = { cuts: [], used: 0, offcut: opts.stockLength };
      boards.push(target);
    }
    target.used += need(target);
    target.cuts.push(piece);
    target.offcut = opts.stockLength - target.used;
  }
  const partLength = pieces.reduce((s, p) => s + p.length, 0);
  const stock = boards.length * opts.stockLength;
  return { boards, oversize, yieldPercent: stock ? (partLength / stock) * 100 : 0 };
}
