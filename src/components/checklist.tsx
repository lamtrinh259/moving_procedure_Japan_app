"use client";

import { useState } from "react";
import type { MoveProfile } from "@/lib/move-profile";
import { proceduresForScenario, type Procedure } from "@/lib/procedures";

type Language = "en" | "ja";
const labels = {
  en: { eyebrow: "Your personalised checklist", title: "A clear plan for your move", tasks: "tasks", complete: "complete", official: "Official guidance", confirm: "Confirm locally" },
  ja: { eyebrow: "あなた専用のチェックリスト", title: "引っ越しのための手続きプラン", tasks: "件の手続き", complete: "完了", official: "公的な案内", confirm: "自治体に要確認" },
} as const;

function dateLabel(date: string, language: Language) {
  return new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "en-GB", { dateStyle: "long" }).format(new Date(`${date}T12:00:00`));
}

export function Checklist({ language, profile, procedureIds }: { language: Language; profile: MoveProfile; procedureIds?: string[] }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const text = labels[language];
  const baseItems = proceduresForScenario(profile.scenario);
  const items = procedureIds
    ? procedureIds.map((id) => baseItems.find((item) => item.id === id)).filter((item): item is Procedure => Boolean(item))
    : baseItems;
  const progress = Math.round((completed.length / items.length) * 100);
  return <section className="checklist" id="your-checklist" aria-labelledby="checklist-title">
    <div className="checklist-heading"><div><p className="eyebrow">{text.eyebrow}</p><h2 id="checklist-title">{text.title}</h2><p>{dateLabel(profile.moveDate, language)} · {profile.currentMunicipality} → {profile.destination}</p></div><div className="progress" aria-label={`${progress}% ${text.complete}`}><strong>{progress}%</strong><span>{completed.length}/{items.length} {text.tasks}</span></div></div>
    <div className="progress-bar" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
    <div className="checklist-items">{items.map((item) => <ChecklistItem item={item} key={item.id} language={language} checked={completed.includes(item.id)} onChange={() => setCompleted((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} />)}</div>
  </section>;
}

function ChecklistItem({ item, language, checked, onChange }: { item: Procedure; language: Language; checked: boolean; onChange: () => void }) {
  const text = labels[language];
  const sourceIsExternal = item.source.url.startsWith("https://");
  return <article className={`checklist-item ${checked ? "is-complete" : ""}`}><label className="task-checkbox"><input type="checkbox" checked={checked} onChange={onChange} /><span aria-hidden="true">✓</span></label><div className="task-content"><div className="task-title"><h3>{item.title[language]}</h3>{item.japaneseName && language === "en" && <span>{item.japaneseName}</span>}</div><p className="task-timing">{item.timing[language]}</p><p>{item.action[language]}</p><div className="task-meta">{sourceIsExternal ? <a href={item.source.url} target="_blank" rel="noreferrer">↗ {text.official}</a> : <span>{language === "ja" ? "自治体・事業者に確認" : "Confirm with municipality or provider"}</span>}{item.municipalityConfirmationRequired && <span className="confirmation">{text.confirm}</span>}</div></div></article>;
}
