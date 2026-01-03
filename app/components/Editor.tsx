"use client";

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  label: string;
  submitLabel: string;
  disabled?: boolean;
  theme: "light" | "dark";
};

export default function Editor({
  value,
  onChange,
  onSubmit,
  placeholder,
  label,
  submitLabel,
  disabled = false,
  theme,
}: EditorProps) {
  return (
    <section
      className={`rounded-xl p-5 shadow-sm ${
        theme === "dark" ? "bg-slate-800" : "bg-white"
      }`}
    >
      <label className="mb-2 block text-sm font-medium opacity-80">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-44 w-full resize-none rounded-lg border p-3 text-sm leading-relaxed focus:outline-none ${
          theme === "dark"
            ? "border-slate-600 bg-slate-900 text-slate-100 focus:ring-slate-400"
            : "border-slate-300 bg-white text-slate-900 focus:ring-slate-900"
        }`}
      />

      <div className="mt-4 flex justify-end">
        <button
          onClick={onSubmit}
          disabled={disabled}
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
        >
          {submitLabel}
        </button>
      </div>
    </section>
  );
}
