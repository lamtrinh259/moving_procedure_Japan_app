import assert from "node:assert/strict";
import test from "node:test";
import { sortProceduresBySchedule } from "@/lib/checklist-schedule";
import type { MoveProfile } from "@/lib/move-profile";
import { proceduresForProfile } from "@/lib/procedures";

function profile(overrides: Partial<MoveProfile> = {}): MoveProfile {
  return {
    scenario: "leavingTemporary",
    moveDate: "2026-09-14",
    currentMunicipality: "Shibuya",
    destination: "United States",
    visaStatus: "Permanent Resident",
    householdSize: 2,
    hasPets: false,
    hasChildren: true,
    hasVehicle: true,
    notes: "",
    ...overrides,
  };
}

test("model-ranked procedures render in chronological order", () => {
  const moveProfile = profile();
  const candidates = proceduresForProfile(moveProfile);
  const modelOrder = [
    "residence-card-departure",
    "utilities",
    "pension-handling",
    "school-transfer",
    "permanent-resident-re-entry",
  ];
  const ranked = modelOrder.map((id) => candidates.find((item) => item.id === id)!);

  assert.deepEqual(
    sortProceduresBySchedule(ranked, moveProfile).map((item) => item.id),
    [
      "permanent-resident-re-entry",
      "school-transfer",
      "pension-handling",
      "utilities",
      "residence-card-departure",
    ],
  );
});

test("special-case municipal dates use the same ordering rules as their labels", () => {
  const moveProfile = profile({ scenario: "betweenMunicipalities", destination: "Yokohama", hasChildren: true });
  const candidates = proceduresForProfile(moveProfile);
  const modelOrder = ["moving-in-notification", "national-health-insurance", "moving-out-notification", "school-transfer"];
  const ranked = modelOrder.map((id) => candidates.find((item) => item.id === id)!);

  assert.deepEqual(
    sortProceduresBySchedule(ranked, moveProfile).map((item) => item.id),
    ["school-transfer", "moving-out-notification", "moving-in-notification", "national-health-insurance"],
  );
});
