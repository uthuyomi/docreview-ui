"use client";

import { useState } from "react";
import Editor from "./components/Editor";
import Loading from "./components/Loading";
import ResultTabs from "./components/ResultTabs";

type Lang = "ja" | "en";
type Theme = "light" | "dark";
type Status = "idle" | "loading" | "done" | "error";

type ReviewResult = {
  issues: string[];
  improvedText: string;
  reasons: string[];
};

const TEXT = {
  ja: {
    title: "DocReview UI",
    subtitle:
      "業務文章を対象に、問題点・改善案・理由を可視化する文書レビューUI",
    inputLabel: "レビューしたい文章",
    placeholder: "ここに業務文章を入力してください",
    reviewButton: "レビューする",
    reviewing: "レビュー中…",
    analyzing: "文章を分析しています…",
    error: "レビュー中にエラーが発生しました。",
    tabs: {
      issues: "問題点",
      improved: "改善案",
      reasons: "理由",
    },
    langLabel: "表示言語",
    themeLabel: "テーマ",
  },
  en: {
    title: "DocReview UI",
    subtitle:
      "A document review UI that visualizes issues, improvements, and reasons for business writing.",
    inputLabel: "Text to review",
    placeholder: "Paste your business text here",
    reviewButton: "Review",
    reviewing: "Reviewing…",
    analyzing: "Analyzing text…",
    error: "An error occurred during review.",
    tabs: {
      issues: "Issues",
      improved: "Improved Draft",
      reasons: "Reasons",
    },
    langLabel: "Language",
    themeLabel: "Theme",
  },
};

export default function Page() {
  const [lang, setLang] = useState<Lang>("ja");
  const [theme, setTheme] = useState<Theme>("light");
  const t = TEXT[lang];

  const [inputText, setInputText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [activeTab, setActiveTab] = useState<"issues" | "improved" | "reasons">(
    "issues"
  );
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* =====================
     FIXED: Real API Call
  ===================== */
  const handleReview = async () => {
    if (!inputText.trim()) return;

    setStatus("loading");
    setResult(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          lang,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? t.error);
      }

      setResult(data as ReviewResult);
      setStatus("done");
      setActiveTab("issues");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : t.error;
      setStatus("error");
      setErrorMessage(message);
    }
  };

  return (
    <main
      className={`min-h-screen p-6 ${
        theme === "dark"
          ? "bg-slate-900 text-slate-100"
          : "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900"
      }`}
    >
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p
              className={`mt-1 max-w-xl text-sm ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {t.subtitle}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="opacity-70">{t.langLabel}</span>
              <button
                onClick={() => setLang("ja")}
                className={`rounded px-2 py-1 ${
                  lang === "ja"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "border opacity-70"
                }`}
              >
                JP
              </button>
              <button
                onClick={() => setLang("en")}
                className={`rounded px-2 py-1 ${
                  lang === "en"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "border opacity-70"
                }`}
              >
                EN
              </button>
            </div>

            <div className="flex items-center gap-1">
              <span className="opacity-70">{t.themeLabel}</span>
              <button
                onClick={() => setTheme("light")}
                className={`rounded px-2 py-1 ${
                  theme === "light"
                    ? "bg-slate-900 text-white"
                    : "border opacity-70"
                }`}
              >
                ☀
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`rounded px-2 py-1 ${
                  theme === "dark"
                    ? "bg-slate-100 text-slate-900"
                    : "border opacity-70"
                }`}
              >
                🌙
              </button>
            </div>
          </div>
        </header>

        {/* Editor */}
        <Editor
          value={inputText}
          onChange={setInputText}
          onSubmit={handleReview}
          placeholder={t.placeholder}
          label={t.inputLabel}
          submitLabel={status === "loading" ? t.reviewing : t.reviewButton}
          disabled={status === "loading" || !inputText.trim()}
          theme={theme}
        />

        {/* Status */}
        {status === "loading" && (
          <Loading message={t.analyzing} theme={theme} />
        )}

        {status === "error" && (
          <div className="rounded-lg bg-red-600/10 p-4 text-sm text-red-400 shadow-sm">
            {errorMessage}
          </div>
        )}

        {/* Result */}
        {status === "done" && result && (
          <ResultTabs
            result={result}
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            labels={t.tabs}
            theme={theme}
          />
        )}
      </div>
    </main>
  );
}
