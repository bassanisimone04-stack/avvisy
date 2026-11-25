/**
 * CNC project cost estimate — a transparent, simplified model, NOT a quote.
 *
 *   material   = sheets × sheetPrice
 *   machine    = machineHours × machineRate
 *   design     = designHours × designRate
 *   tooling    = toolingCost
 *   finishing  = finishingCost
 *   subtotal   = material + machine + design + setupFee + tooling + finishing
 *   total      = subtotal × (1 + markup%)
 *   perPiece   = total / quantity
 */
import { InputError } from "./board-foot";

export interface CncCostInput {
  quantity: number;
  sheets: number;
  sheetPrice: number;
  machineHours: number;
  machineRate: number;
  designHours: number;
  designRate: number;
  setupFee: number;
  toolingCost: number;
  finishingCost: number;
  markupPercent: number;
}

export interface CncCostBreakdown {
  lines: { key: string; label: string; amount: number }[];
  subtotal: number;
  markup: number;
  total: number;
  perPiece: number;
}

function nonNegative(name: string, v: number) {
  if (!Number.isFinite(v) || v < 0) throw new InputError(`${name} must be zero or more.`);
}

export function cncProjectCost(i: CncCostInput): CncCostBreakdown {
  if (!Number.isInteger(i.quantity) || i.quantity < 1) throw new InputError("Quantity must be a whole number of at least 1.");
  const fields: [string, number][] = [
    ["Sheets", i.sheets],
    ["Sheet price", i.sheetPrice],
    ["Machine hours", i.machineHours],
    ["Machine rate", i.machineRate],
    ["Design hours", i.designHours],
    ["Design rate", i.designRate],
    ["Setup fee", i.setupFee],
    ["Tooling", i.toolingCost],
    ["Finishing", i.finishingCost],
    ["Markup", i.markupPercent],
  ];
  fields.forEach(([n, v]) => nonNegative(n, v));
  if (i.markupPercent > 500) throw new InputError("Markup must be 500% or less.");

  const lines = [
    { key: "material", label: "Material", amount: i.sheets * i.sheetPrice },
    { key: "machine", label: "Machine time", amount: i.machineHours * i.machineRate },
    { key: "design", label: "Design & CAM", amount: i.designHours * i.designRate },
    { key: "setup", label: "Setup", amount: i.setupFee },
    { key: "tooling", label: "Tooling wear", amount: i.toolingCost },
    { key: "finishing", label: "Finishing", amount: i.finishingCost },
  ];
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const markup = subtotal * (i.markupPercent / 100);
  const total = subtotal + markup;
  return { lines, subtotal, markup, total, perPiece: total / i.quantity };
}
