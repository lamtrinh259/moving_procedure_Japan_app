import assert from "node:assert/strict";
import test from "node:test";
import type { MoveProfile } from "@/lib/move-profile";
import { procedures, proceduresForProfile } from "@/lib/procedures";

function profile(overrides: Partial<MoveProfile> = {}): MoveProfile {
  return {
    scenario: "leavingTemporary",
    moveDate: "2026-09-05",
    currentMunicipality: "Shibuya",
    destination: "United States",
    visaStatus: "Permanent Resident",
    householdSize: 2,
    hasPets: false,
    hasChildren: false,
    hasVehicle: false,
    notes: "",
    ...overrides,
  };
}

test("PR temporary departure shows only the PR-specific re-entry task", () => {
  const ids = proceduresForProfile(profile()).map((item) => item.id);
  assert.equal(ids.includes("permanent-resident-re-entry"), true);
  assert.equal(ids.includes("re-entry-permit"), false);
});

test("school and vehicle procedures use direct answers rather than household size or notes", () => {
  const noDependants = proceduresForProfile(profile({ notes: "I have a motorbike" })).map((item) => item.id);
  assert.equal(noDependants.includes("school-transfer"), false);
  assert.equal(noDependants.includes("vehicle-arrangements"), false);

  const applicable = proceduresForProfile(profile({ hasChildren: true, hasVehicle: true })).map((item) => item.id);
  assert.equal(applicable.includes("school-transfer"), true);
  assert.equal(applicable.includes("vehicle-arrangements"), true);
});

test("pension decision is scheduled before departure", () => {
  assert.equal(procedures.find((item) => item.id === "pension-handling")?.schedule, "before30");
});
