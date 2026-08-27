# Japan Moving Assistant

A bilingual (English/Japanese) web app that helps people moving in, within, or out of Japan understand their required procedures, deadlines, and documents.

## Stack

- Next.js App Router and React
- TypeScript
- Tailwind CSS
- ESLint

## Local development

Use Node.js 22.13 or newer, then install and run the app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Development workflow

Each feature is developed on a focused `codex/<feature>` branch, checked with `npm run lint` and `npm run build`, then merged into `main` through a focused commit.

The app must treat procedural guidance as reviewed reference content. It should show authoritative sources and a review date; model output will only personalize and order that curated content.
