# DocReview UI

業務メールや文章を対象に、  
**問題点・改善案・理由**を整理して可視化する文章レビューUIです。

「この文章で本当に伝わるのか？」
「どこが曖昧なのか？」
「なぜそう直すべきなのか？」

そういった悩みを、UI上で一目で確認できることを目的に作りました。

▶ Demo  
https://docreview-ui.vercel.app/

---

## Features

- 業務文章のレビュー
  - 問題点の指摘
  - 改善案（自然な業務文）
  - 改善理由の説明
- 日本語 / 英語対応
- シンプルなUIで即レビュー可能
- ブラウザだけで利用可能（インストール不要）

---

## Use cases

- 業務メールの送信前チェック
- 社内外向け文章の推敲
- 曖昧な表現・伝わりにくい箇所の洗い出し
- 日本語 / 英語のビジネス文レビュー

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- OpenAI API (Responses API)
- Tailwind CSS
- Vercel

---

## How it works

1. レビューしたい文章を入力
2. 言語を選択（日本語 / 英語）
3. レビュー実行
4. 以下をタブ形式で表示
   - Issues（問題点）
   - Improved Draft（改善案）
   - Reasons（理由）

---

## Local Development

```bash
git clone https://github.com/uthuyomi/docreview-ui.git
cd docreview-ui
npm install
