// app/api/review/route.ts
import { NextResponse } from "next/server";
import { buildReviewInstructions } from "@/lib/reviewPrompt";

/* =====================
   Types
===================== */

type Lang = "ja" | "en";

type ReviewResult = {
  issues: string[];
  improvedText: string;
  reasons: string[];
};

type ReviewRequestBody = {
  text: string;
  lang?: Lang;
};

type OpenAIOutputText = {
  type: "output_text";
  text: string;
};

type OpenAIMessageContent = OpenAIOutputText | { type: string };

type OpenAIMessage = {
  type: "message";
  content: OpenAIMessageContent[];
};

type OpenAIResponsePayload = {
  output_text?: string;
  output?: OpenAIMessage[];
  error?: {
    message?: string;
  };
  message?: string;
};

export const runtime = "nodejs";

/* =====================
   Type Guards
===================== */

function isOutputText(
  content: OpenAIMessageContent
): content is OpenAIOutputText {
  return content.type === "output_text";
}

/* =====================
   Utils
===================== */

function jsonError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

function extractOutputText(payload: OpenAIResponsePayload): string {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  if (!Array.isArray(payload.output)) return "";

  const texts: string[] = [];

  for (const item of payload.output) {
    if (item.type !== "message") continue;

    for (const content of item.content) {
      if (isOutputText(content)) {
        texts.push(content.text);
      }
    }
  }

  return texts.join("\n").trim();
}

function isReviewResult(value: unknown): value is ReviewResult {
  if (typeof value !== "object" || value === null) return false;

  const v = value as Record<string, unknown>;

  return (
    Array.isArray(v.issues) &&
    v.issues.every((i) => typeof i === "string") &&
    typeof v.improvedText === "string" &&
    Array.isArray(v.reasons) &&
    v.reasons.every((r) => typeof r === "string")
  );
}

/* =====================
   Handler
===================== */

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonError(500, "OPENAI_API_KEY が .env に設定されていません。");
  }

  let body: ReviewRequestBody;
  try {
    body = (await req.json()) as ReviewRequestBody;
  } catch {
    return jsonError(400, "リクエストボディがJSONではありません。");
  }

  const text = typeof body.text === "string" ? body.text : "";
  const lang: Lang = body.lang === "en" ? "en" : "ja";

  if (!text.trim()) {
    return jsonError(400, "text が空です。");
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-5.2";

  // ★ buildReviewInstructions を使用
  const instructions = buildReviewInstructions({ lang });

  // ★ Responses API 正式形式の schema
  const schema = {
    type: "json_schema",
    name: "docreview_result",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issues: {
          type: "array",
          items: { type: "string" },
        },
        improvedText: {
          type: "string",
        },
        reasons: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["issues", "improvedText", "reasons"],
    },
  } as const;

  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        instructions,
        input: text,
        text: {
          format: schema, // ★ name が直下に来る
        },
        temperature: 0.2,
        max_output_tokens: 2000,
        store: false,
      }),
    });

    const payload = (await res.json()) as OpenAIResponsePayload;

    if (!res.ok) {
      const message =
        payload.error?.message ??
        payload.message ??
        `OpenAI API error (${res.status})`;
      return NextResponse.json({ error: message }, { status: 500 });
    }

    const outputText = extractOutputText(payload);
    if (!outputText) {
      return NextResponse.json(
        { error: "モデル出力が空でした。" },
        { status: 500 }
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      return NextResponse.json(
        {
          error: "モデル出力のJSONパースに失敗しました。",
          raw: outputText,
        },
        { status: 500 }
      );
    }

    if (!isReviewResult(parsed)) {
      return NextResponse.json(
        { error: "モデル出力が期待スキーマと一致しませんでした。" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown server error";
    return NextResponse.json(
      {
        error: "サーバー側で例外が発生しました。",
        detail: message,
      },
      { status: 500 }
    );
  }
}
