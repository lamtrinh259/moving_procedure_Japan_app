"use client";

import { useState } from "react";
import { OnboardingForm } from "@/components/onboarding-form";
import { Checklist } from "@/components/checklist";
import type { MoveProfile } from "@/lib/move-profile";
import type { ChecklistRecommendation } from "@/lib/checklist-recommendation";

type Language = "en" | "ja";

const copy = {
  en: {
    language: "日本語",
    eyebrow: "Moving made clear",
    title: "Your practical guide to moving in Japan.",
    description:
      "Tell us a little about your move. We’ll turn Japan’s procedures into a clear, personal checklist with the right timing.",
    start: "Build my checklist",
    reassurance: "Built for foreign residents · Free to use · Takes about 2 minutes",
    sectionTitle: "A calmer way to move",
    steps: [
      ["1", "Share your plan", "Your move date, destination, and situation."],
      ["2", "See what applies", "Only the procedures relevant to you."],
      ["3", "Stay on track", "Know what to bring and when to act."],
    ],
    sampleLabel: "YOUR PERSONAL TIMELINE",
    sampleTitle: "Your first 14 days",
    sampleTask: "Submit your moving-in notification",
    sampleDetails: "City or ward office · Bring your residence card",
    sampleDeadline: "Due within 14 days",
    sourceNote: "Guidance is based on reviewed official sources. Always confirm requirements with your municipality.",
  },
  ja: {
    language: "English",
    eyebrow: "引っ越しの手続きを、わかりやすく",
    title: "日本での引っ越しを、もっとシンプルに。",
    description:
      "引っ越しの予定をお聞かせください。必要な手続きと期限を、あなた専用のチェックリストにまとめます。",
    start: "チェックリストを作る",
    reassurance: "外国籍の方向け · 無料で利用可能 · 約2分で完了",
    sectionTitle: "落ち着いて進められる引っ越し手続き",
    steps: [
      ["1", "予定を入力", "引っ越し日、行き先、状況を教えてください。"],
      ["2", "必要な手続きを確認", "あなたに必要な手続きだけを表示します。"],
      ["3", "期限を逃さない", "持ち物と手続きの時期がわかります。"],
    ],
    sampleLabel: "あなただけのタイムライン",
    sampleTitle: "最初の14日間",
    sampleTask: "転入届を提出する",
    sampleDetails: "市区町村役場 · 在留カードを持参",
    sampleDeadline: "転入後14日以内",
    sourceNote: "案内は確認済みの公的情報をもとにしています。詳細はお住まいの自治体にご確認ください。",
  },
} as const;

export function LandingShell() {
  const [language, setLanguage] = useState<Language>("en");
  const [profile, setProfile] = useState<MoveProfile | null>(null);
  const [recommendation, setRecommendation] = useState<ChecklistRecommendation | null>(null);
  const text = copy[language];

  async function generateChecklist(nextProfile: MoveProfile) {
    const response = await fetch("/api/checklist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(nextProfile) });
    const result = await response.json() as ChecklistRecommendation;
    setRecommendation(result);
    setProfile(nextProfile);
    requestAnimationFrame(() => document.getElementById("your-checklist")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <main className="site-shell" lang={language}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Japan Moving Assistant home">
          <span className="brand-mark" aria-hidden="true">日</span>
          <span>Japan Moving Assistant</span>
        </a>
        <button
          className="language-toggle"
          type="button"
          onClick={() => setLanguage(language === "en" ? "ja" : "en")}
          aria-label={`Switch to ${text.language}`}
        >
          <span aria-hidden="true">{language === "en" ? "🇯🇵" : "🇬🇧"}</span>
          {text.language}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">{text.eyebrow}</p>
          <h1>{text.title}</h1>
          <p className="hero-description">{text.description}</p>
          <a className="primary-action" href="#build-checklist">{text.start} <span aria-hidden="true">→</span></a>
          <p className="reassurance">{text.reassurance}</p>
        </div>

        <aside className="timeline-card" aria-label={text.sampleTitle}>
          <p className="card-label">{text.sampleLabel}</p>
          <h2>{text.sampleTitle}</h2>
          <div className="timeline-row">
            <span className="timeline-dot" aria-hidden="true" />
            <div>
              <h3>{text.sampleTask}</h3>
              <p>{text.sampleDetails}</p>
            </div>
          </div>
          <p className="deadline"><span aria-hidden="true">●</span> {text.sampleDeadline}</p>
        </aside>
      </section>

      <section className="how-it-works" id="how-it-works">
        <h2>{text.sectionTitle}</h2>
        <div className="step-list">
          {text.steps.map(([number, title, description]) => (
            <article className="step" key={number}>
              <span className="step-number">{number}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <OnboardingForm language={language} onGenerate={generateChecklist} />
      {profile && <Checklist language={language} profile={profile} procedureIds={recommendation?.procedureIds} />}

      <footer>{text.sourceNote}</footer>
    </main>
  );
}
