export type ChecklistRecommendation = {
  procedureIds: string[];
  highlights: Array<{ procedureId: string; message: string }>;
  mode: "ai" | "fallback";
};
