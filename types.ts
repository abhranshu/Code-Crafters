export interface FinancialData {
  annualRevenue: number;
  yearsInBusiness: number;
  loanAmount: number;
}

export interface SustainabilityData {
  renewableEnergyUsage: number;
  estimatedCarbonReduction: number;
  esgComplianceScore: number;
  wasteManagement: string;
  wasteScore: number; // 0–100
}

export interface GreenBreakdown {
  renewable_usage: number;
  renewable_contribution: number;
  emission_reduction: number;
  emission_contribution: number;
  waste_management: number;
  waste_contribution: number;
}

export interface EvaluationAnalysis {
  green_breakdown: GreenBreakdown;
  risk_drivers: string[];
  summary: string;
}

export interface LoanEvaluationResult {
  riskScore: number;
  riskLevel?: string; // Risk level from backend (Low, Medium, High)
  sustainabilityScore: number;
  decision: 'Approved' | 'Under Review' | 'Rejected';
  exactDecision?: string; // The specific decision string from backend
  interestRate?: number; // Recommended interest rate from backend
  aiExplanation: string;
  recommendations: string[];
  analysis?: EvaluationAnalysis;
}

export type Page = 'landing' | 'dashboard' | 'evaluate' | 'portfolio' | 'analytics' | 'settings' | 'signin' | 'signup';
