import { test } from "node:test";
import assert from "node:assert/strict";
import { buildICal, parseICalBusy } from "./ical";

const cal = (body: string) => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\n${body}\r\nEND:VCALENDAR\r\n`;
const W0 = new Date("2026-10-01T00:00:00Z");
const W1 = new Date("2026-10-20T00:00:00Z");

test("evento UTC semplice", () => {
  const r = parseICalBusy(cal("BEGIN:VEVENT\r\nUID:a\r\nDTSTART:20261005T080000Z\r\nDTEND:20261005T090000Z\r\nEND:VEVENT"), W0, W1);
  assert.equal(r.busy.length, 1);
  assert.equal(r.busy[0].start.toISOString(), "2026-10-05T08:00:00.000Z");
});

test("TZID Europe/Rome e ora legale", () => {
  // 5 ottobre: CEST (UTC+2). 27 ottobre: CET (UTC+1).
  const r = parseICalBusy(
    cal(
      "BEGIN:VEVENT\r\nUID:b\r\nDTSTART;TZID=Europe/Rome:20261005T100000\r\nDTEND;TZID=Europe/Rome:20261005T110000\r\nEND:VEVENT\r\n" +
        "BEGIN:VEVENT\r\nUID:c\r\nDTSTART;TZID=Europe/Rome:20261027T100000\r\nDTEND;TZID=Europe/Rome:20261027T110000\r\nEND:VEVENT",
    ),
    W0,
    new Date("2026-11-01T00:00:00Z"),
  );
  assert.deepEqual(r.busy.map((b) => b.start.toISOString()), ["2026-10-05T08:00:00.000Z", "2026-10-27T09:00:00.000Z"]);
});

test("ricorrenza settimanale con BYDAY, COUNT ed EXDATE", () => {
  const r = parseICalBusy(
    cal(
      "BEGIN:VEVENT\r\nUID:d\r\nDTSTART;TZID=Europe/Rome:20260928T180000\r\nDTEND;TZID=Europe/Rome:20260928T190000\r\n" +
        "RRULE:FREQ=WEEKLY;BYDAY=MO,WE;COUNT=6\r\nEXDATE;TZID=Europe/Rome:20261007T180000\r\nEND:VEVENT",
    ),
    W0,
    W1,
  );
  // Occorrenze: 28/9, 30/9 (fuori finestra), 5/10, 7/10 (esclusa), 12/10, 14/10
  assert.deepEqual(r.busy.map((b) => b.start.toISOString().slice(0, 10)), ["2026-10-05", "2026-10-12", "2026-10-14"]);
  assert.equal(r.unsupported, 0);
});

test("occorrenza modificata (RECURRENCE-ID) sostituisce l'originale", () => {
  const r = parseICalBusy(
    cal(
      "BEGIN:VEVENT\r\nUID:e\r\nDTSTART:20261001T100000Z\r\nDTEND:20261001T110000Z\r\nRRULE:FREQ=DAILY;COUNT=3\r\nEND:VEVENT\r\n" +
        "BEGIN:VEVENT\r\nUID:e\r\nRECURRENCE-ID:20261002T100000Z\r\nDTSTART:20261002T150000Z\r\nDTEND:20261002T160000Z\r\nEND:VEVENT",
    ),
    W0,
    W1,
  );
  assert.deepEqual(r.busy.map((b) => b.start.toISOString()), ["2026-10-01T10:00:00.000Z", "2026-10-02T15:00:00.000Z", "2026-10-03T10:00:00.000Z"]);
});

test("eventi trasparenti, cancellati e all-day", () => {
  const r = parseICalBusy(
    cal(
      "BEGIN:VEVENT\r\nUID:f\r\nDTSTART:20261003T100000Z\r\nDTEND:20261003T110000Z\r\nTRANSP:TRANSPARENT\r\nEND:VEVENT\r\n" +
        "BEGIN:VEVENT\r\nUID:g\r\nDTSTART:20261003T100000Z\r\nDTEND:20261003T110000Z\r\nSTATUS:CANCELLED\r\nEND:VEVENT\r\n" +
        "BEGIN:VEVENT\r\nUID:h\r\nDTSTART;VALUE=DATE:20261004\r\nDTEND;VALUE=DATE:20261005\r\nEND:VEVENT",
    ),
    W0,
    W1,
  );
  assert.equal(r.busy.length, 1);
  assert.equal(r.busy[0].start.toISOString(), "2026-10-03T22:00:00.000Z"); // mezzanotte a Roma
});

test("regole non supportate vengono segnalate", () => {
  const r = parseICalBusy(cal("BEGIN:VEVENT\r\nUID:i\r\nDTSTART:20261001T100000Z\r\nDTEND:20261001T110000Z\r\nRRULE:FREQ=MONTHLY;BYDAY=1MO\r\nEND:VEVENT"), W0, W1);
  assert.equal(r.unsupported, 1);
});

test("export → import andata e ritorno", () => {
  const text = buildICal("Visite", [{ uid: "v1@x", start: new Date("2026-10-06T08:00:00Z"), end: new Date("2026-10-06T08:30:00Z"), summary: "Visita, Via Roma 1", description: "riga1\nriga2", location: "Milano" }]);
  const r = parseICalBusy(text, W0, W1);
  assert.equal(r.busy.length, 1);
  assert.equal(r.busy[0].end.toISOString(), "2026-10-06T08:30:00.000Z");
});
