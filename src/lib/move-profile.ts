export type MoveScenario = "sameMunicipality" | "betweenMunicipalities" | "leavingTemporary" | "leavingPermanent";

export type MoveProfile = {
  scenario: MoveScenario;
  moveDate: string;
  currentMunicipality: string;
  destination: string;
  visaStatus: string;
  householdSize: number;
  hasPets: boolean;
  hasChildren: boolean;
  hasVehicle: boolean;
  notes: string;
};
