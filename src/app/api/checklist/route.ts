import OpenAI from "openai";
import { NextResponse } from "next/server";
import type { ChecklistRecommendation } from "@/lib/checklist-recommendation";
import type { MoveProfile } from "@/lib/move-profile";
import { proceduresForScenario, type MoveScenario } from "@/lib/procedures";

const scenarios: MoveScenario[] = ["sameMunicipality", "betweenMunicipalities", "leavingTemporary", "leavingPermanent"];

function validProfile(value: unknown): value is MoveProfile {
  if (!value || typeof value !== "object") return false;
  const profile = value as Record<string, unknown>;
  return scenarios.includes(profile.scenario as MoveScenario)
    && typeof profile.moveDate === "string"
    && typeof profile.currentMunicipality === "string"
    && typeof profile.destination === "string"
    && typeof profile.visaStatus === "string"
    && typeof profile.householdSize === "number"
    && typeof profile.hasPets === "boolean"
    && typeof profile.notes === "string";
}

function fallback(profile: MoveProfile): ChecklistRecommendation {
  return { procedureIds: proceduresForScenario(profile.scenario).map((item) => item.id), highlights: [], mode: "fallback" };
}

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  if (!validProfile(payload)) return NextResponse.json({ error: "Invalid move profile." }, { status: 400 });

  const knownProcedures = proceduresForScenario(payload.scenario);
  if (!process.env.OPENAI_API_KEY) return NextResponse.json(fallback(payload));

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
      store: false,
      instructions: "You help prioritize a Japan moving checklist. You must only return IDs from the supplied procedures. Do not create legal, immigration, tax, or procedural claims. Return every supplied procedure ID exactly once, placing the most urgent or consequential first. Highlights may only explain why a listed item is especially important, using cautious plain language.",
      input: JSON.stringify({ profile: payload, procedures: knownProcedures.map((item) => ({ id: item.id, title: item.title.en, timing: item.timing.en, important: item.important ?? false })) }),
      text: {
        format: {
          type: "json_schema",
          name: "checklist_recommendation",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["procedureIds", "highlights"],
            properties: {
              procedureIds: { type: "array", items: { type: "string", enum: knownProcedures.map((item) => item.id) } },
              highlights: { type: "array", items: { type: "object", additionalProperties: false, required: ["procedureId", "message"], properties: { procedureId: { type: "string", enum: knownProcedures.map((item) => item.id) }, message: { type: "string" } } } },
            },
          },
        },
      },
    });
    const parsed = JSON.parse(response.output_text) as Omit<ChecklistRecommendation, "mode">;
    const knownIds = new Set(knownProcedures.map((item) => item.id));
    const procedureIds = [...new Set(parsed.procedureIds.filter((id) => knownIds.has(id)))];
    const missingIds = knownProcedures.map((item) => item.id).filter((id) => !procedureIds.includes(id));
    return NextResponse.json({ procedureIds: [...procedureIds, ...missingIds], highlights: parsed.highlights.filter((highlight) => knownIds.has(highlight.procedureId)), mode: "ai" satisfies ChecklistRecommendation["mode"] });
  } catch {
    return NextResponse.json(fallback(payload));
  }
}
