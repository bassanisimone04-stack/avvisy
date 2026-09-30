import { test } from "node:test";
import assert from "node:assert/strict";
import { computeFreeSlots } from "./slots";

// Giovedì 1 ottobre 2026, 07:00 UTC = 09:00 a Roma
const now = new Date("2026-10-01T07:00:00Z");

test("solo fasce dentro le regole, dopo il preavviso minimo", () => {
  const slots = computeFreeSlots({ rules: [{ weekday: 3, start_min: 9 * 60, end_min: 12 * 60 }], busy: [], booked: [], slotMinutes: 30, now, days: 0 });
  // preavviso 2h → dalle 11:00 in poi: 11:00, 11:30
  assert.deepEqual(slots.map((s) => s.start.toISOString()), ["2026-10-01T09:00:00.000Z", "2026-10-01T09:30:00.000Z"]);
});

test("gli impegni del calendario e le visite già prenotate tolgono fasce", () => {
  const slots = computeFreeSlots({
    rules: [{ weekday: 4, start_min: 10 * 60, end_min: 12 * 60 }], // venerdì 2/10
    busy: [{ start: new Date("2026-10-02T08:15:00Z"), end: new Date("2026-10-02T08:45:00Z") }],
    booked: [{ start: new Date("2026-10-02T09:30:00Z"), end: new Date("2026-10-02T10:00:00Z") }],
    slotMinutes: 30,
    now,
    days: 1,
  });
  // Impegno 10:15-10:45 ora di Roma, visita 11:30-12:00.
  // 10:00 ✗ (sovrapposta all'impegno) | 10:30 ✗ | 11:00 ✓ | 11:30 ✗ (visita)
  assert.deepEqual(slots.map((s) => s.start.toISOString()), ["2026-10-02T09:00:00.000Z"]);
});

test("il passaggio all'ora solare è gestito", () => {
  // Domenica 25 ottobre 2026 si torna all'ora solare: le 10:00 di Roma passano da 08:00Z a 09:00Z
  const slots = computeFreeSlots({ rules: [{ weekday: 0, start_min: 10 * 60, end_min: 10 * 60 + 30 }], busy: [], booked: [], slotMinutes: 30, now, days: 30 });
  assert.deepEqual(slots.map((s) => s.start.toISOString()), [
    "2026-10-05T08:00:00.000Z",
    "2026-10-12T08:00:00.000Z",
    "2026-10-19T08:00:00.000Z",
    "2026-10-26T09:00:00.000Z",
  ]);
});
