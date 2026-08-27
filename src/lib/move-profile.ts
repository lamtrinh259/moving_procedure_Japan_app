import type { MoveScenario } from "@/lib/procedures";

export type MoveProfile = {
  scenario: MoveScenario;
  moveDate: string;
  currentMunicipality: string;
  destination: string;
  visaStatus: string;
  householdSize: number;
  hasPets: boolean;
  notes: string;
};
