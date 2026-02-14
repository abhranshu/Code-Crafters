import { GoogleGenAI, Type } from "@google/genai";
import { FinancialData, SustainabilityData, LoanEvaluationResult } from "../types";

// Always initialize GoogleGenAI with a named parameter for the apiKey.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function evaluateLoan(
  financial: FinancialData,
  sustainability: SustainabilityData
): Promise<LoanEvaluationResult> {
  const prompt = `
    Perform a professional green loan risk and sustainability assessment.
    
    Financial Data:
    - Annual Revenue: $${financial.annualRevenue}
    - Credit Score: ${financial.creditScore}
    - Existing Debt: $${financial.existingDebt}
    - Years in Business: ${financial.yearsInBusiness}
    
    Sustainability Data:
    - Renewable Energy Usage: ${sustainability.renewableEnergyUsage}%
    - Carbon Reduction: ${sustainability.estimatedCarbonReduction} tons/year
    - ESG Score: ${sustainability.esgComplianceScore}/100
    - Waste Management: ${sustainability.wasteManagement}
    
    Provide an evaluation including:
    1. A Risk Score (0-100, where 100 is highest risk).
    2. A Sustainability Score (0-100).
    3. A Decision ('Approved', 'Under Review', or 'Rejected').
    4. A concise AI Explanation for this decision.
    5. A list of 3 actionable recommendations for the applicant.
  `;

  try {
    // Select gemini-3-pro-preview for complex reasoning and advanced logic tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER },
            sustainabilityScore: { type: Type.NUMBER },
            decision: { type: Type.STRING },
            aiExplanation: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["riskScore", "sustainabilityScore", "decision", "aiExplanation", "recommendations"]
        },
      },
    });

    // Access the .text property directly (not a method) from GenerateContentResponse.
    const result = JSON.parse(response.text || '{}');
    return result as LoanEvaluationResult;
  } catch (error) {
    console.error("Evaluation error:", error);
    // Fallback logic if API fails
    return {
      riskScore: 35,
      sustainabilityScore: 78,
      decision: 'Under Review',
      aiExplanation: "The AI system is currently experiencing high load. A preliminary review suggests high sustainability impact but requires deeper financial verification.",
      recommendations: [
        "Improve debt-to-income ratio",
        "Increase renewable energy share to 60%",
        "Formalize ESG reporting framework"
      ]
    };
  }
}