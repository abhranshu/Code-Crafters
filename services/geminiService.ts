import { FinancialData, SustainabilityData, LoanEvaluationResult } from "../types";

export async function evaluateLoan(
  financial: FinancialData,
  sustainability: SustainabilityData
): Promise<LoanEvaluationResult> {
  // Waste: use explicit wasteScore (0–100) when provided; else fallback from category
  const wasteScoreMap: Record<string, number> = { 'A-Elite': 100, 'B-Advanced': 80, 'C-Standard': 60, 'D-Basic': 40 };
  const wasteScore = typeof sustainability.wasteScore === 'number' ? sustainability.wasteScore : (wasteScoreMap[sustainability.wasteManagement] ?? 50);

  const payload = {
    financial_features: [
      financial.annualRevenue,
      financial.yearsInBusiness,
      financial.loanAmount
    ],
    renewable: sustainability.renewableEnergyUsage,
    emission: sustainability.estimatedCarbonReduction,
    waste: wasteScore
  };

  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Backend returns:
    // {
    //     "default_probability (%)": float,
    //     "risk_level": string,
    //     "green_score": float,
    //     "decision": string,
    //     "recommended_interest_rate (%)": float
    // }

    // Map back to LoanEvaluationResult
    const decision = data.decision as string;

    // Generate explanation and recommendations based on result (since backend doesn't provide them yet)
    const explanation = `Based on the analysis, the application is marked as ${decision}. The calculated default probability is ${data["default_probability (%)"]}%, with a Green Score of ${data.green_score}.`;

    let recommendations: string[] = [];
    if (decision === 'Approved' || decision === 'Approved with Green Incentive') {
      recommendations = [
        "Proceed with loan disbursement.",
        "Monitor quarterly ESG compliance.",
        "Consider offering further green incentives."
      ];
    } else if (decision === 'Conditionally Approved' || decision === 'Under Review') {
      recommendations = [
        "Request additional collateral.",
        "Review detailed emission reports.",
        "Re-evaluate in 6 months."
      ];
    } else {
      recommendations = [
        "Improve credit score.",
        "Reduce existing debt load.",
        "Enhance sustainability practices to qualify for green programs."
      ];
    }

    // Normalize decision string to match enum if needed, though 'Approved with Green Incentive' might not match exactly.
    // Frontend expects 'Approved' | 'Under Review' | 'Rejected'.
    // Backend can return 'Approved with Green Incentive', 'Conditionally Approved'.

    let normalizedDecision: 'Approved' | 'Under Review' | 'Rejected' = 'Under Review';
    if (decision.includes('Approved')) normalizedDecision = 'Approved';
    else if (decision === 'Rejected') normalizedDecision = 'Rejected';

    return {
      riskScore: Math.round(data["default_probability (%)"]),
      riskLevel: data.risk_level,
      sustainabilityScore: Math.round(data.green_score),
      decision: normalizedDecision,
      exactDecision: decision,
      interestRate: data["recommended_interest_rate (%)"],
      aiExplanation: explanation,
      recommendations: recommendations,
      analysis: data.analysis,
    };

  } catch (error) {
    console.error("Evaluation error:", error);
    throw error;
  }
}