# DocReview UI

業務メールや文章を対象に、  
**問題点・改善案・理由**を構造的に整理・可視化する文章レビューUIです。

「この文章で本当に意図が伝わるのか」  
「どこが曖昧で、なぜ直す必要があるのか」

──そういった判断を**感覚ではなく、確認可能な形で行えるUI**を目指して設計しました。

▶ Demo  
https://docreview-ui.vercel.app/

---

## Background / Motivation

業務文章のレビューは、多くの場合、

- 「なんとなく違和感がある」
- 「もっと良くできそうだが、理由を説明しづらい」
- 「修正理由が属人的になりやすい」

といった問題を抱えがちです。

DocReview UI は、  
**文章の良し悪しを「結果＋理由」で確認できるUI**を通じて、  
レビューの属人性を下げ、判断を補助することを目的としています。

---

## Features

- 業務文章のレビュー
  - 問題点の指摘（Issues）
  - 改善案（Improved Draft）
  - 改善理由（Reasons）
- 日本語 / 英語対応
- 入力 → レビュー → 結果表示までを1画面で完結
- 状態（Loading / Error / Result）を明確に分離したUI設計
- ブラウザのみで利用可能（インストール不要）

---

## Use Cases

- 業務メール送信前のセルフチェック
- 社内レビュー時の論点整理
- 日本語 / 英語ビジネス文の推敲
- 曖昧な表現・意図不明瞭な箇所の洗い出し

---

## UI / UX Design Notes

- **入力 → 非同期処理 → 結果表示**の流れを明確に分離
- ローディング・エラー・成功状態をUI上で明示
- 結果は「問題点 / 改善案 / 理由」をタブで切り替え可能
- 長文でも読みやすいレイアウトを意識
- 多言語対応を前提としたテキスト管理

---

## Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **OpenAI API (Responses API)**
- **Tailwind CSS**
- **Vercel**

---

## How it works

1. レビューしたい文章を入力
2. 言語を選択（日本語 / 英語）
3. レビューを実行
4. 以下をタブ形式で表示
   - Issues（問題点）
   - Improved Draft（改善案）
   - Reasons（理由）

---

## Architecture Overview

- フロントエンド
  - React（Function Components / Hooks）
  - 状態管理（入力・結果・ローディング・エラー）
- API
  - Next.js Route Handler
  - OpenAI Responses API を使用
  - JSON Schema による出力構造の制約
- UI
  - コンポーネント分割（Editor / ResultTabs / Loading）
  - Tailwind CSS によるスタイル管理

---

## Local Development

```bash
git clone https://github.com/uthuyomi/docreview-ui.git
cd docreview-ui
npm install
npm run dev
※ OpenAI API Key が必要です
