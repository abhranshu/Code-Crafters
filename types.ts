export interface FinancialData {
  annualRevenue: number;
  creditScore: number;
  existingDebt: number;
  yearsInBusiness: number;
}

export interface SustainabilityData {
  renewableEnergyUsage: number;
  estimatedCarbonReduction: number;
  esgComplianceScore: number;
  wasteManagement: string;
}

export interface LoanEvaluationResult {
  riskScore: number;
  sustainabilityScore: number;
  decision: 'Approved' | 'Under Review' | 'Rejected';
  aiExplanation: string;
  recommendations: string[];
}

export type Page = 'landing' | 'dashboard' | 'evaluate' | 'portfolio' | 'analytics' | 'settings';
