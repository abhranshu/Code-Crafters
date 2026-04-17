/**
 * Evaluation Engine database service (Supabase).
 * Saves and fetches loan evaluations from the loan_evaluations table.
 */

import { supabase } from "./supabase";
import type { FinancialData, SustainabilityData, LoanEvaluationResult } from "../types";

export interface EvaluationRecord {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  annual_revenue: number;
  years_in_business: number;
  loan_amount: number;
  renewable_energy_usage: number;
  estimated_carbon_reduction: number;
  waste_management: string;
  waste_score: number;
  risk_score: number;
  risk_level: string | null;
  sustainability_score: number;
  decision: string;
  exact_decision: string | null;
  ai_explanation: string;
  recommendations: string[];
  analysis: Record<string, unknown> | null;
  raw_response: Record<string, unknown> | null;
}

/**
 * Save an evaluation to the database.
 * Call after a successful Run Analysis.
 */
export async function saveEvaluation(
  financial: FinancialData,
  sustainability: SustainabilityData,
  result: LoanEvaluationResult,
  rawResponse?: Record<string, unknown>
): Promise<EvaluationRecord | null> {
  const row = {
    user_id: null as string | null,
    annual_revenue: financial.annualRevenue,
    years_in_business: financial.yearsInBusiness,
    loan_amount: financial.loanAmount,
    renewable_energy_usage: sustainability.renewableEnergyUsage,
    estimated_carbon_reduction: sustainability.estimatedCarbonReduction,
    waste_management: sustainability.wasteManagement,
    waste_score: sustainability.wasteScore,
    risk_score: result.riskScore,
    risk_level: result.riskLevel ?? null,
    sustainability_score: result.sustainabilityScore,
    decision: result.decision,
    exact_decision: result.exactDecision ?? null,
    ai_explanation: result.aiExplanation,
    recommendations: result.recommendations ?? [],
    analysis: result.analysis ?? null,
    raw_response: rawResponse ?? null,
  };

  try {
    const { data: user } = await supabase.auth.getUser();
    if (user?.user?.id) row.user_id = user.user.id;
  } catch {
    // continue without user_id
  }

  const { data, error } = await supabase
    .from("loan_evaluations")
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error("Evaluation DB save error:", error);
    return null;
  }
  return data as EvaluationRecord;
}

/**
 * Fetch recent evaluations (e.g. for history or dashboard).
 */
export async function getEvaluations(limit = 50): Promise<EvaluationRecord[]> {
  const { data, error } = await supabase
    .from("loan_evaluations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Evaluation DB fetch error:", error);
    return [];
  }
  return (data ?? []) as EvaluationRecord[];
}

/**
 * Fetch one evaluation by id.
 */
export async function getEvaluationById(id: string): Promise<EvaluationRecord | null> {
  const { data, error } = await supabase
    .from("loan_evaluations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Evaluation DB fetch by id error:", error);
    return null;
  }
  return data as EvaluationRecord;
}
