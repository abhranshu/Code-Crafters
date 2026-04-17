# Evaluation Engine database

This folder contains the database schema for the **Evaluation Engine**. Each Run Analysis saves inputs and results to Supabase.

## Setup

1. Open your [Supabase project](https://supabase.com/dashboard) → **SQL Editor**.
2. Copy the contents of `evaluation_engine_schema.sql` and run it.
3. Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `.env.local`.

## Table: `loan_evaluations`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto) |
| created_at, updated_at | TIMESTAMPTZ | Timestamps |
| user_id | UUID | Optional – from Supabase Auth |
| annual_revenue, years_in_business, loan_amount | numeric/int | Financial inputs |
| renewable_energy_usage, estimated_carbon_reduction, waste_management, waste_score | numeric/text/int | Sustainability inputs |
| risk_score, risk_level, sustainability_score, decision, exact_decision | numeric/text | Engine results |
| ai_explanation, recommendations (JSONB), analysis (JSONB) | text/jsonb | Explanation and breakdown |

## Usage in app

- **Save:** Every Run Analysis automatically saves a row via `services/evaluationDatabase.ts` → `saveEvaluation()`.
- **Read:** Use `getEvaluations()` or `getEvaluationById(id)` from `evaluationDatabase.ts` for history or dashboards.
