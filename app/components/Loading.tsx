"use client";

type LoadingProps = {
  message: string;
  theme: "light" | "dark";
};

export default function Loading({ message, theme }: LoadingProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg p-4 text-sm shadow-sm ${
        theme === "dark"
          ? "bg-slate-800 text-slate-300"
          : "bg-white text-slate-600"
      }`}
    >
      {/* Spinner */}
      <span
        className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
          theme === "dark" ? "border-slate-400" : "border-slate-500"
        }`}
      />

      {/* Message */}
      <span>{message}</span>
    </div>
  );
}
