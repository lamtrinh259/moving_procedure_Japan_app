import type { MoveProfile, MoveScenario } from "@/lib/move-profile";
export type { MoveScenario } from "@/lib/move-profile";

export type ProcedureCategory =
  | "municipal"
  | "residency"
  | "insuranceAndPension"
  | "tax"
  | "homeAndServices"
  | "household";

type LocalizedText = { en: string; ja: string };
export type ScheduleRule = "before90" | "before60" | "before30" | "before14" | "onMoveDate" | "after14";

export type Procedure = {
  id: string;
  category: ProcedureCategory;
  title: LocalizedText;
  japaneseName?: string;
  appliesTo: MoveScenario[];
  timing: LocalizedText;
  action: LocalizedText;
  important?: boolean;
  source: { label: string; url: string };
  municipalityConfirmationRequired?: boolean;
  schedule?: ScheduleRule;
  requires?: { hasPets?: boolean; hasChildren?: boolean; hasVehicle?: boolean; visaStatuses?: string[]; excludeVisaStatuses?: string[] };
};

/**
 * Reviewed procedure seed data. Every item must retain an authoritative source;
 * municipality-specific instructions are intentionally marked for confirmation.
 */
export const procedures: Procedure[] = [
  {
    id: "moving-out-notification",
    category: "municipal",
    title: { en: "Submit a moving-out notification", ja: "転出届を提出する" },
    japaneseName: "転出届",
    appliesTo: ["betweenMunicipalities", "leavingTemporary", "leavingPermanent"],
    timing: { en: "Ask your current municipality about its filing window before your move.", ja: "転出前に、現在の市区町村へ届出可能な期間を確認してください。" },
    action: { en: "Notify your current municipal office that you are leaving the address.", ja: "現在住んでいる市区町村に、住所を離れることを届け出ます。" },
    important: true,
    source: { label: "Immigration Services Agency: address-change notification", url: "https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri10_00023.html" },
    municipalityConfirmationRequired: true,
  },
  {
    id: "moving-in-notification",
    category: "municipal",
    title: { en: "Submit a moving-in notification", ja: "転入届を提出する" },
    japaneseName: "転入届",
    appliesTo: ["betweenMunicipalities"],
    timing: { en: "Within 14 days after moving into your new address.", ja: "新しい住所に住み始めてから14日以内。" },
    action: { en: "File at your new municipal office and bring your residence card.", ja: "新しい住所の市区町村窓口で、在留カードを持参して届け出ます。" },
    important: true,
    schedule: "after14",
    source: { label: "Immigration Services Agency: address-change notification", url: "https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri10_00023.html" },
    municipalityConfirmationRequired: true,
  },
  {
    id: "address-change-notification",
    category: "municipal",
    title: { en: "Submit an address-change notification", ja: "転居届を提出する" },
    japaneseName: "転居届",
    appliesTo: ["sameMunicipality"],
    timing: { en: "Within 14 days after moving.", ja: "引っ越してから14日以内。" },
    action: { en: "File at your municipality and bring your residence card.", ja: "市区町村窓口で、在留カードを持参して届け出ます。" },
    important: true,
    schedule: "after14",
    source: { label: "Immigration Services Agency: address-change notification", url: "https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri10_00023.html" },
    municipalityConfirmationRequired: true,
  },
  {
    id: "residence-card-address",
    category: "residency",
    title: { en: "Update the address on your residence card", ja: "在留カードの住所を更新する" },
    appliesTo: ["sameMunicipality", "betweenMunicipalities"],
    timing: { en: "Within 14 days after moving to the new address.", ja: "新しい住所に移ってから14日以内。" },
    action: { en: "Present your residence card when filing the municipal move-in or address-change notification.", ja: "市区町村で転入届または転居届を出す際、在留カードを提示します。" },
    important: true,
    schedule: "after14",
    source: { label: "Immigration Services Agency: address-change notification", url: "https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri10_00023.html" },
  },
  {
    id: "re-entry-permit",
    category: "residency",
    title: { en: "Confirm your re-entry permission", ja: "再入国許可を確認する" },
    japaneseName: "再入国許可",
    appliesTo: ["leavingTemporary"],
    timing: { en: "Before departure. The re-entry route depends on your planned return date and period of stay.", ja: "出国前。再入国の方法は、帰国予定日と在留期間によって異なります。" },
    action: { en: "Check whether deemed re-entry applies or whether you need to apply for a re-entry permit before leaving Japan.", ja: "みなし再入国許可が使えるか、または事前に再入国許可の申請が必要かを確認します。" },
    important: true,
    schedule: "before90",
    requires: { excludeVisaStatuses: ["Permanent Resident", "永住者"] },
    source: { label: "Immigration Services Agency: immigration and residence Q&A", url: "https://www.moj.go.jp/isa/applications/guide/kanri_qa.html" },
  },
  {
    id: "national-health-insurance",
    category: "insuranceAndPension",
    title: { en: "Check National Health Insurance handling", ja: "国民健康保険の手続きを確認する" },
    japaneseName: "国民健康保険",
    appliesTo: ["sameMunicipality", "betweenMunicipalities", "leavingTemporary", "leavingPermanent"],
    timing: { en: "At the address-change visit, if you are enrolled in National Health Insurance.", ja: "国民健康保険に加入している場合は、住所変更の手続き時に確認します。" },
    action: { en: "Ask the municipal office what change, cancellation, or enrollment action applies to your move.", ja: "引っ越しに伴う変更、脱退、加入の手続きを市区町村窓口で確認します。" },
    source: { label: "Japan Moving Procedures Reference", url: "#municipal-office-confirmation" },
    municipalityConfirmationRequired: true,
    schedule: "before14",
  },
  {
    id: "pension-handling",
    category: "insuranceAndPension",
    title: { en: "Review your pension options", ja: "年金の選択肢を確認する" },
    japaneseName: "国民年金",
    appliesTo: ["leavingTemporary", "leavingPermanent"],
    timing: { en: "Before departure; some post-departure applications have a two-year deadline.", ja: "出国前に確認。出国後の申請には2年の期限があるものがあります。" },
    action: { en: "Check your coverage, voluntary-contribution options, and possible lump-sum withdrawal eligibility.", ja: "加入状況、任意加入、脱退一時金の対象条件を確認します。" },
    source: { label: "Japan Pension Service: Lump-sum Withdrawal Payments", url: "https://www.nenkin.go.jp/international/english/japanese-system/benefit/payment.html" },
    schedule: "before30",
  },
  {
    id: "tax-representative",
    category: "tax",
    title: { en: "Arrange resident-tax administration", ja: "住民税の納税管理を手配する" },
    japaneseName: "納税管理人",
    appliesTo: ["leavingTemporary", "leavingPermanent"],
    timing: { en: "Before departure, if tax notices may arrive after you leave.", ja: "出国後に税の通知が届く可能性がある場合は、出国前に。" },
    action: { en: "Ask your municipality or tax office whether to appoint a tax representative and how to settle outstanding tax.", ja: "納税管理人の指定や未納税額の精算について、市区町村または税務署に確認します。" },
    source: { label: "Japan Moving Procedures Reference", url: "#municipal-office-confirmation" },
    municipalityConfirmationRequired: true,
    schedule: "before30",
  },
  {
    id: "mail-forwarding",
    category: "homeAndServices",
    title: { en: "Set up mail forwarding", ja: "郵便の転送届を出す" },
    japaneseName: "転居・転送サービス",
    appliesTo: ["sameMunicipality", "betweenMunicipalities"],
    timing: { en: "Submit before you move; forwarding is free for one year from submission.", ja: "引っ越し前に提出。転送期間は届出から1年間、無料です。" },
    action: { en: "Submit a relocation form with Japan Post and bring the requested identification if applying at a counter.", ja: "日本郵便に転居届を提出します。窓口で手続きする場合は必要な本人確認書類を持参します。" },
    source: { label: "Japan Post: Relocation/forwarding service", url: "https://www.post.japanpost.jp/service/tenkyo/index_en.html" },
    schedule: "before30",
  },
  {
    id: "utilities",
    category: "homeAndServices",
    title: { en: "Arrange utility changes", ja: "電気・ガス・水道の手続きをする" },
    appliesTo: ["sameMunicipality", "betweenMunicipalities", "leavingTemporary", "leavingPermanent"],
    timing: { en: "Before the move, following each provider’s notice requirements.", ja: "各事業者の連絡期限を確認し、引っ越し前に手続きします。" },
    action: { en: "Schedule service stop at the old home and start at the new home, or settle final bills when leaving Japan.", ja: "旧居の停止と新居の開始を予約し、出国時は最終料金を精算します。" },
    source: { label: "Japan Moving Procedures Reference", url: "#provider-confirmation" },
    municipalityConfirmationRequired: true,
    schedule: "before14",
  },
  {
    id: "school-transfer",
    category: "household",
    title: { en: "Plan a school transfer", ja: "お子さまの転校手続きをする" },
    appliesTo: ["betweenMunicipalities", "leavingTemporary", "leavingPermanent"],
    timing: { en: "Start before the move, where applicable.", ja: "該当する場合は、引っ越し前に始めます。" },
    action: { en: "Contact the current school and ask the new municipality or school about the transfer process.", ja: "現在の学校に連絡し、新しい市区町村または学校に転校手続きを確認します。" },
    source: { label: "Japan Moving Procedures Reference", url: "#school-confirmation" },
    municipalityConfirmationRequired: true,
    schedule: "before60",
    requires: { hasChildren: true },
  },
  {
    id: "pet-registration",
    category: "household",
    title: { en: "Review pet-related procedures", ja: "ペットに関する手続きを確認する" },
    appliesTo: ["sameMunicipality", "betweenMunicipalities", "leavingTemporary", "leavingPermanent"],
    timing: { en: "Begin early, especially when leaving Japan with a pet.", ja: "特にペットを連れて出国する場合は、早めに始めます。" },
    action: { en: "Check local registration changes and, for international travel, the destination country’s import and quarantine requirements.", ja: "地域で必要な登録変更と、海外渡航の場合は渡航先の輸入・検疫要件を確認します。" },
    source: { label: "Japan Moving Procedures Reference", url: "#pet-confirmation" },
    municipalityConfirmationRequired: true,
    schedule: "before90",
    requires: { hasPets: true },
  },
  {
    id: "vehicle-arrangements",
    category: "household",
    title: { en: "Review vehicle arrangements", ja: "車両に関する手続きを確認する" },
    appliesTo: ["sameMunicipality", "betweenMunicipalities", "leavingTemporary", "leavingPermanent"],
    timing: { en: "Start before the move; registration, parking, insurance, sale, or export steps vary by vehicle and destination.", ja: "引っ越し前に開始。登録、駐車場、保険、売却、輸出の手続きは車両と行き先によって異なります。" },
    action: { en: "Check which address-change, registration, insurance, sale, or export steps apply to your car, motorcycle, or bicycle.", ja: "自動車、バイク、自転車に必要な住所変更、登録、保険、売却、輸出の手続きを確認します。" },
    schedule: "before30",
    requires: { hasVehicle: true },
    source: { label: "Japan Moving Procedures Reference", url: "#vehicle-confirmation" },
    municipalityConfirmationRequired: true,
  },
  {
    id: "residence-card-departure",
    category: "residency",
    title: { en: "Handle your residence card at departure", ja: "出国時の在留カードを確認する" },
    japaneseName: "在留カード",
    appliesTo: ["leavingTemporary", "leavingPermanent"],
    timing: { en: "On departure day.", ja: "出国当日。" },
    action: { en: "Keep your card for a valid temporary departure with re-entry permission. If permanently leaving, confirm surrender requirements with immigration before departure.", ja: "再入国許可を使って一時出国する場合は在留カードを保持します。永続的に出国する場合は、出国前に返納要件を入管へ確認してください。" },
    important: true,
    schedule: "onMoveDate",
    source: { label: "Immigration Services Agency: immigration and residence Q&A", url: "https://www.moj.go.jp/isa/applications/guide/kanri_qa.html" },
  },
  {
    id: "bank-account-departure",
    category: "homeAndServices",
    title: { en: "Review your bank-account arrangements", ja: "銀行口座の取扱いを確認する" },
    appliesTo: ["leavingTemporary", "leavingPermanent"],
    timing: { en: "Before departure; bank policies for non-residents vary.", ja: "出国前。非居住者となる場合の取扱いは銀行によって異なります。" },
    action: { en: "Ask your bank whether your account can remain open and how to update your address or close the account.", ja: "口座を継続できるか、住所変更や解約の方法を銀行に確認します。" },
    schedule: "before30",
    source: { label: "Japan Moving Procedures Reference", url: "#bank-confirmation" },
    municipalityConfirmationRequired: true,
  },
  {
    id: "my-number-departure",
    category: "municipal",
    title: { en: "Confirm My Number procedures", ja: "マイナンバーの手続きを確認する" },
    japaneseName: "マイナンバーカード",
    appliesTo: ["leavingTemporary", "leavingPermanent"],
    timing: { en: "At your municipal-office departure procedure.", ja: "市区町村での転出手続き時。" },
    action: { en: "Confirm the card and registration steps that apply to your departure and intended return.", ja: "出国と帰国予定に応じたカード・登録の手続きを市区町村に確認します。" },
    schedule: "before14",
    source: { label: "Japan Moving Procedures Reference", url: "#municipal-office-confirmation" },
    municipalityConfirmationRequired: true,
  },
  {
    id: "permanent-resident-re-entry",
    category: "residency",
    title: { en: "Protect your permanent-resident status", ja: "永住者としての再入国手続きを確認する" },
    appliesTo: ["leavingTemporary"],
    timing: { en: "Before departure. Your planned absence determines whether a permit is needed.", ja: "出国前。予定する海外滞在期間により必要な手続きが異なります。" },
    action: { en: "For an absence beyond the deemed re-entry period, apply for a re-entry permit before leaving. Confirm your planned return remains within the permit and residence-status validity periods.", ja: "みなし再入国許可の対象期間を超える場合は、出国前に再入国許可を申請します。帰国予定日が許可と在留資格の有効期間内であることを確認します。" },
    important: true,
    schedule: "before90",
    requires: { visaStatuses: ["Permanent Resident", "永住者"] },
    source: { label: "Immigration Services Agency: immigration and residence Q&A", url: "https://www.moj.go.jp/isa/applications/guide/kanri_qa.html" },
  },
];

export function proceduresForProfile(profile: MoveProfile) {
  return procedures.filter((procedure) => procedure.appliesTo.includes(profile.scenario)
    && (!procedure.requires?.hasPets || profile.hasPets)
    && (!procedure.requires?.hasChildren || profile.hasChildren)
    && (!procedure.requires?.hasVehicle || profile.hasVehicle)
    && (!procedure.requires?.visaStatuses || procedure.requires.visaStatuses.includes(profile.visaStatus))
    && (!procedure.requires?.excludeVisaStatuses || !procedure.requires.excludeVisaStatuses.includes(profile.visaStatus)));
}
