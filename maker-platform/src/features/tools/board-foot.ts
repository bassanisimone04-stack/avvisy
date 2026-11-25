/**
 * Board foot math.
 *   1 board foot (BF) = 144 in³ = 1 in × 12 in × 12 in
 *   BF = thickness(in) × width(in) × length(in) / 144
 *   1 BF = 0.00235974 m³  (exact: 144 × 0.0254³)
 * Lumber is usually sold by NOMINAL rough thickness ("quarters": 4/4 = 1 in,
 * 8/4 = 2 in). Use the rough thickness you pay for, not the planed size.
 */
export const CUBIC_INCHES_PER_BF = 144;
export const CUBIC_METERS_PER_BF = 144 * 0.0254 ** 3;

export type LengthUnit = "in" | "ft" | "mm" | "cm" | "m";

const toInches: Record<LengthUnit, number> = { in: 1, ft: 12, mm: 1 / 25.4, cm: 1 / 2.54, m: 1 / 0.0254 };

export function convertToInches(value: number, unit: LengthUnit): number {
  return value * toInches[unit];
}

export interface BoardInput {
  thickness: number;
  thicknessUnit: LengthUnit;
  width: number;
  widthUnit: LengthUnit;
  length: number;
  lengthUnit: LengthUnit;
  quantity: number;
}

export interface BoardFootResult {
  boardFeetEach: number;
  boardFeetTotal: number;
  /** Total including the waste allowance. */
  boardFeetWithWaste: number;
  cubicMetersTotal: number;
  cost: number | null;
}

export class InputError extends Error {}

export function assertPositive(name: string, v: number) {
  if (!Number.isFinite(v) || v <= 0) throw new InputError(`${name} must be a number greater than zero.`);
}

export function boardFeet(input: BoardInput, opts: { pricePerBF?: number | null; wastePercent?: number } = {}): BoardFootResult {
  assertPositive("Thickness", input.thickness);
  assertPositive("Width", input.width);
  assertPositive("Length", input.length);
  if (!Number.isInteger(input.quantity) || input.quantity < 1) throw new InputError("Quantity must be a whole number of at least 1.");
  const waste = opts.wastePercent ?? 0;
  if (!Number.isFinite(waste) || waste < 0 || waste > 100) throw new InputError("Waste must be between 0 and 100%.");

  const t = convertToInches(input.thickness, input.thicknessUnit);
  const w = convertToInches(input.width, input.widthUnit);
  const l = convertToInches(input.length, input.lengthUnit);
  const each = (t * w * l) / CUBIC_INCHES_PER_BF;
  const total = each * input.quantity;
  const withWaste = total * (1 + waste / 100);
  const price = opts.pricePerBF ?? null;
  if (price !== null && (!Number.isFinite(price) || price < 0)) throw new InputError("Price must be zero or more.");
  return {
    boardFeetEach: each,
    boardFeetTotal: total,
    boardFeetWithWaste: withWaste,
    cubicMetersTotal: total * CUBIC_METERS_PER_BF,
    cost: price === null ? null : withWaste * price,
  };
}

/** Common hardwood thicknesses in quarters. */
export const quarterSawnSizes = [
  { label: "4/4 (1″)", inches: 1 },
  { label: "5/4 (1¼″)", inches: 1.25 },
  { label: "6/4 (1½″)", inches: 1.5 },
  { label: "8/4 (2″)", inches: 2 },
  { label: "12/4 (3″)", inches: 3 },
];
