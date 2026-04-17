-- Evaluation Engine database schema for Supabase (PostgreSQL)
-- Run this in the Supabase SQL Editor to create the table.

-- Table: loan_evaluations
-- Stores each run of the Evaluation Engine (inputs + results).
CREATE TABLE IF NOT EXISTS loan_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Optional: link to authenticated user (Supabase Auth)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Financial inputs
  annual_revenue NUMERIC NOT NULL,
  years_in_business INTEGER NOT NULL,
  loan_amount NUMERIC NOT NULL,

  -- Sustainability inputs
  renewable_energy_usage NUMERIC NOT NULL,
  estimated_carbon_reduction NUMERIC NOT NULL,
  waste_management TEXT NOT NULL,
  waste_score INTEGER NOT NULL,

  -- Results from engine
  risk_score NUMERIC NOT NULL,
  risk_level TEXT,
  sustainability_score NUMERIC NOT NULL,
  decision TEXT NOT NULL,
  exact_decision TEXT,
  ai_explanation TEXT NOT NULL,
  recommendations JSONB NOT NULL DEFAULT '[]',
  analysis JSONB,

  -- Optional: raw response from backend (for debugging/audit)
  raw_response JSONB
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_loan_evaluations_created_at ON loan_evaluations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_loan_evaluations_user_id ON loan_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_evaluations_decision ON loan_evaluations(decision);

-- Optional: trigger to keep updated_at in sync
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS loan_evaluations_updated_at ON loan_evaluations;
CREATE TRIGGER loan_evaluations_updated_at
  BEFORE UPDATE ON loan_evaluations
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- Optional: Row Level Security (RLS) – enable if you want per-user access
-- ALTER TABLE loan_evaluations ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can read own evaluations" ON loan_evaluations FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can insert own evaluations" ON loan_evaluations FOR INSERT WITH CHECK (auth.uid() = user_id);

COMMENT ON TABLE loan_evaluations IS 'Evaluation Engine: stores financial + sustainability inputs and AI evaluation results';
