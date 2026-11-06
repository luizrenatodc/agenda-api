import test from "node:test";
import assert from "node:assert/strict";
import { Agenda } from "../src/agenda.ts";

test("lista o expediente inteiro quando está vazio", () => {
  const h = new Agenda().livres("ana", "2030-01-07", 30);
  assert.equal(h[0], "09:00");
  assert.equal(h.at(-1), "17:30");
});
test("recusa sobreposição e libera outro profissional", () => {
  const a = new Agenda();
  a.reservar("ana", "João", new Date("2030-01-07T10:00:00"), 60);
  assert.throws(() => a.reservar("ana", "Maria", new Date("2030-01-07T10:30:00"), 30), /ocupado/);
  assert.ok(a.reservar("bia", "Maria", new Date("2030-01-07T10:30:00"), 30));
});
test("horário encostado não conflita e cancelar libera", () => {
  const a = new Agenda();
  const r = a.reservar("ana", "João", new Date("2030-01-07T10:00:00"), 60);
  assert.ok(a.reservar("ana", "Maria", new Date("2030-01-07T11:00:00"), 30));
  assert.ok(!a.livres("ana", "2030-01-07", 30).includes("10:00"));
  assert.equal(a.cancelar(r.id), true);
  assert.ok(a.livres("ana", "2030-01-07", 30).includes("10:00"));
});
