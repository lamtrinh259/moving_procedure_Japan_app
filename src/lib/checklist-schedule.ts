import type { MoveProfile } from "@/lib/move-profile";
import type { Procedure, ScheduleRule } from "@/lib/procedures";

const scheduleOffsets: Record<ScheduleRule, number> = {
  before90: -90,
  before60: -60,
  before30: -30,
  before14: -14,
  onMoveDate: 0,
  after14: 14,
};

export function scheduleOffsetDays(item: Procedure, profile: MoveProfile) {
  if (item.id === "moving-out-notification") return -14;
  if (item.id === "national-health-insurance"
    && (profile.scenario === "sameMunicipality" || profile.scenario === "betweenMunicipalities")) return 14;
  return item.schedule ? scheduleOffsets[item.schedule] : 0;
}

export function sortProceduresBySchedule(items: Procedure[], profile: MoveProfile) {
  return items
    .map((item, originalIndex) => ({ item, originalIndex }))
    .sort((left, right) => scheduleOffsetDays(left.item, profile) - scheduleOffsetDays(right.item, profile)
      || left.originalIndex - right.originalIndex)
    .map(({ item }) => item);
}
