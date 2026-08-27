"use client";

import { FormEvent, useState } from "react";

type Language = "en" | "ja";
type MoveType = "sameMunicipality" | "betweenMunicipalities" | "leavingTemporary" | "leavingPermanent";

const copy = {
  en: {
    eyebrow: "Build your checklist",
    title: "Tell us about your move",
    intro: "We’ll use these details to show only the procedures and deadlines that apply to you.",
    moveType: "What kind of move are you planning?",
    moveDate: "Move or departure date",
    currentMunicipality: "Current city, ward, or municipality",
    destinationMunicipality: "New city, ward, or municipality",
    destinationCountry: "Destination country",
    visaStatus: "Residence status",
    household: "How many people are moving, including you?",
    pets: "Are any pets moving with you?",
    notes: "Anything else we should know? (optional)",
    notesHint: "For example: employer-provided housing, a vehicle, or a child starting school.",
    submit: "Create my checklist",
    submitted: "Your details are ready. Checklist generation will be added next.",
    options: {
      select: "Select an option",
      sameMunicipality: "Within the same city, ward, or municipality",
      betweenMunicipalities: "To another municipality in Japan",
      leavingTemporary: "Leaving Japan temporarily and planning to return",
      leavingPermanent: "Leaving Japan permanently",
      no: "No",
      yes: "Yes",
      visa: ["Permanent Resident", "Work visa", "Student", "Dependent", "Spouse or child of Japanese national", "Other"],
    },
  },
  ja: {
    eyebrow: "チェックリストを作成",
    title: "引っ越しの予定を教えてください",
    intro: "入力内容をもとに、あなたに必要な手続きと期限だけを表示します。",
    moveType: "どのような引っ越しですか？",
    moveDate: "引っ越し・出国予定日",
    currentMunicipality: "現在の市区町村",
    destinationMunicipality: "新しい市区町村",
    destinationCountry: "渡航先の国",
    visaStatus: "在留資格",
    household: "あなたを含め、何人で引っ越しますか？",
    pets: "ペットも一緒に引っ越しますか？",
    notes: "ほかに伝えておきたいこと（任意）",
    notesHint: "例：社宅、車の所有、お子さまの転校予定など。",
    submit: "チェックリストを作る",
    submitted: "入力内容を受け取りました。チェックリストの生成は次の機能で追加します。",
    options: {
      select: "選択してください",
      sameMunicipality: "同じ市区町村内での引っ越し",
      betweenMunicipalities: "日本国内の別の市区町村への引っ越し",
      leavingTemporary: "一時的に日本を離れ、帰国予定がある",
      leavingPermanent: "日本を永続的に出国する",
      no: "いいえ",
      yes: "はい",
      visa: ["永住者", "就労ビザ", "留学", "家族滞在", "日本人の配偶者等", "その他"],
    },
  },
} as const;

export function OnboardingForm({ language }: { language: Language }) {
  const [moveType, setMoveType] = useState<MoveType | "">("");
  const [submitted, setSubmitted] = useState(false);
  const text = copy[language];
  const leavingJapan = moveType === "leavingTemporary" || moveType === "leavingPermanent";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="onboarding" id="build-checklist" aria-labelledby="onboarding-title">
      <div className="onboarding-intro">
        <p className="eyebrow">{text.eyebrow}</p>
        <h2 id="onboarding-title">{text.title}</h2>
        <p>{text.intro}</p>
      </div>

      <form className="move-form" onSubmit={submit}>
        <fieldset>
          <legend>{text.moveType}</legend>
          <div className="choice-grid">
            {(["sameMunicipality", "betweenMunicipalities", "leavingTemporary", "leavingPermanent"] as const).map((option) => (
              <label className="choice" key={option}>
                <input type="radio" name="moveType" value={option} checked={moveType === option} onChange={() => { setMoveType(option); setSubmitted(false); }} required />
                <span>{text.options[option]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field-grid">
          <label><span>{text.moveDate}</span><input type="date" name="moveDate" required /></label>
          <label><span>{text.currentMunicipality}</span><input type="text" name="currentMunicipality" autoComplete="address-level2" required /></label>
          <label><span>{leavingJapan ? text.destinationCountry : text.destinationMunicipality}</span><input type="text" name="destination" autoComplete={leavingJapan ? "country-name" : "address-level2"} required /></label>
          <label><span>{text.visaStatus}</span><select name="visaStatus" defaultValue="" required><option value="" disabled>{text.options.select}</option>{text.options.visa.map((visa) => <option key={visa} value={visa}>{visa}</option>)}</select></label>
          <label><span>{text.household}</span><select name="householdSize" defaultValue="1" required>{[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count === 6 ? "6+" : count}</option>)}</select></label>
          <label><span>{text.pets}</span><select name="pets" defaultValue="no" required><option value="no">{text.options.no}</option><option value="yes">{text.options.yes}</option></select></label>
        </div>
        <label className="notes"><span>{text.notes}</span><textarea name="notes" rows={3} placeholder={text.notesHint} /></label>
        <button className="primary-action" type="submit">{text.submit} <span aria-hidden="true">→</span></button>
        {submitted && <p className="form-feedback" role="status">{text.submitted}</p>}
      </form>
    </section>
  );
}
