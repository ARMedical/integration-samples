This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## MaskFit AR examples

Set your credential in `.env.local` (server side only, never expose the secret to the browser):

```
MASKFIT_AR_API_URL=https://portal.maskfitar.com
MASKFIT_AR_API_KEY=your_api_key
MASKFIT_AR_API_SECRET=your_api_secret
```

| Page | What it shows |
| --- | --- |
| `/scan` | Authenticate, request a face-scan link for a patient and send them to the MaskFit-hosted scan page |
| `/questionnaire` | Fetch a patient's questionnaire, render it in your own UI and submit answers back (no hosted page) |

All MaskFit API calls are server actions in `src/actions/index.ts`.

### Questionnaire example

`listQuestions(lookup)` → `GET /api/questions/` returns every question available to your institution with the patient's existing `answer`. `lookup` is one of `email`, `phone` or `external_id` (your own identifier) — the patient must already exist in MaskFit.

Each question carries what you need to render it: `question_type` (`radio` with `options`, or `text`), `input_type` (widget hint: `enum`, `number`, `email`, `phone`, `date`, `year`, …), `required`, a JSON Schema `validation_rule`, a JSON Schema `visibility_rule` evaluated against the answers object (`{}` = always visible), and `category` / `position` for grouping and ordering. `src/lib/questionnaire.ts` shows grouping, visibility and validation using [Ajv](https://ajv.js.org/).

`submitAnswers(lookup, answers)` → `PATCH /api/questions/` with `answers: { [questionId]: value }` — the option id for radio questions, a string otherwise. Only the questions included are updated (send `""` to clear one); unknown ids come back in `data.skipped_question_ids`.

Every response uses the envelope `{ status, error, error_code, data }`; the actions return it unchanged so the UI can display `error` (e.g. `ENTITY_NOT_FOUND` when no patient matches).
