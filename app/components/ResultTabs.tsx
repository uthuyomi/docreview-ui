"use client";

type ReviewResult = {
  issues: string[];
  improvedText: string;
  reasons: string[];
};

type Tabs = "issues" | "improved" | "reasons";

type ResultTabsProps = {
  result: ReviewResult;
  activeTab: Tabs;
  onChangeTab: (tab: Tabs) => void;
  labels: {
    issues: string;
    improved: string;
    reasons: string;
  };
  theme: "light" | "dark";
};

export default function ResultTabs({
  result,
  activeTab,
  onChangeTab,
  labels,
  theme,
}: ResultTabsProps) {
  return (
    <section
      className={`rounded-xl p-5 shadow-sm ${
        theme === "dark" ? "bg-slate-800" : "bg-white"
      }`}
    >
      {/* Tabs */}
      <div
        className={`mb-4 flex gap-4 border-b text-sm ${
          theme === "dark" ? "border-slate-600/40" : "border-slate-200"
        }`}
      >
        {(["issues", "improved", "reasons"] as Tabs[]).map((key) => (
          <button
            key={key}
            onClick={() => onChangeTab(key)}
            className={`pb-2 transition ${
              activeTab === key
                ? "border-b-2 border-current font-medium opacity-100"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            {labels[key]}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "issues" && (
        <ul className="list-disc space-y-2 pl-5 text-sm opacity-90">
          {result.issues.map((issue, idx) => (
            <li key={idx}>{issue}</li>
          ))}
        </ul>
      )}

      {activeTab === "improved" && (
        <pre
          className={`whitespace-pre-wrap rounded-lg p-4 text-sm ${
            theme === "dark"
              ? "bg-slate-900 text-slate-100"
              : "bg-slate-50 text-slate-800"
          }`}
        >
          {result.improvedText}
        </pre>
      )}

      {activeTab === "reasons" && (
        <ul className="list-disc space-y-2 pl-5 text-sm opacity-90">
          {result.reasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
