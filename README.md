# Budget Tracker (Next.js + Supabase + Tailwind + Chart.js)

A minimal, secure-enough MVP to track monthly budget with categories, transactions, and charts.

## Features
- Magic link login (Supabase)
- Categories (expense/income)
- Transactions with date, amount, category, note
- Dashboard with:
  - Pie (spending by category this month)
  - Line (daily net flow this month)
- DOP by default (change labels as needed)

## Setup

1) **Create Supabase project** and copy your URL + ANON key.
2) **Database schema**: open the SQL editor in Supabase and run `supabase/schema.sql`.
3) **Auth**: enable Email `Sign in with magic link`.
4) **RLS Policies**: the SQL includes Row-Level Security policies per user.
5) **Env**: copy `.env.example` to `.env` and fill:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
6) **Install deps & run**
```bash
npm i
npm run dev
```
Open http://localhost:3000

## shadcn (optional, later)
This starter uses Tailwind utility styles to stay small.
If you want shadcn/ui, run:
```bash
npx shadcn@latest init
npx shadcn@latest add button input select dialog table
```
Then replace the minimal CSS classes with shadcn components.

## Notes
- Charts use `react-chartjs-2`/Chart.js, no custom colors specified.
- All data access is client-side via Supabase JS + RLS, so no server secrets here.
- For CSV import/export, add endpoints or client-side parsers later.

MIT
