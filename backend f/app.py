from flask import Flask, request, jsonify
import numpy as np
import os
import json
from datetime import datetime

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__)

# Supabase PostgreSQL connection (optional). Set DATABASE_URL in .env to enable.
def get_db_connection():
    url = os.environ.get("DATABASE_URL")
    if not url:
        return None
    try:
        import psycopg2
        return psycopg2.connect(url)
    except Exception as e:
        print(f"DB connection error: {e}")
        return None

def save_evaluation_to_db(financial_features, renewable, emission, waste, default_pct, risk_level, green_score, decision, interest_rate, analysis, response_data):
    conn = get_db_connection()
    if not conn:
        return
    try:
        cur = conn.cursor()
        annual_revenue = financial_features[0] if len(financial_features) > 0 else 0
        years_in_business = int(financial_features[1]) if len(financial_features) > 1 else 0
        loan_amount = financial_features[2] if len(financial_features) > 2 else 0
        ai_explanation = f"Default probability {default_pct}%, Green Score {green_score}, Decision: {decision}. Recommended rate {interest_rate}%."
        cur.execute(
            """
            INSERT INTO loan_evaluations (
                annual_revenue, years_in_business, loan_amount,
                renewable_energy_usage, estimated_carbon_reduction, waste_management, waste_score,
                risk_score, risk_level, sustainability_score, decision, exact_decision, ai_explanation,
                recommendations, analysis, raw_response
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                annual_revenue, years_in_business, loan_amount,
                float(renewable), float(emission), "N/A", int(waste),
                float(default_pct), risk_level, float(green_score), decision, decision, ai_explanation,
                json.dumps([]), json.dumps(analysis) if analysis else None, json.dumps(response_data) if response_data else None,
            ),
        )
        conn.commit()
        cur.close()
    except Exception as e:
        print(f"DB insert error: {e}")
    finally:
        conn.close()

# Load model (local file) or use stub if missing
MODEL_PATH = "credit_default_model.pkl"
model = None

if os.path.isfile(MODEL_PATH):
    try:
        import joblib
        model = joblib.load(MODEL_PATH)
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None

if model is None:
    # Stub model when .pkl is missing or incompatible
    class StubModel:
        def predict(self, X):
            p = self.predict_proba(X)
            return np.array([0 if p[i, 1] < 0.5 else 1 for i in range(len(X))])
        def predict_proba(self, X):
            n = len(X)
            # Default probability based on first feature (annual revenue) and second (credit score)
            probs = []
            for i in range(n):
                rev = float(X[i, 0]) if X.shape[1] > 0 else 0
                cred = float(X[i, 1]) if X.shape[1] > 1 else 500
                p1 = min(0.9, max(0.05, 0.5 - (rev / 2e6) * 0.3 - (cred - 500) / 1000 * 0.2))
                probs.append([1 - p1, p1])
            return np.array(probs)
    model = StubModel()


# ---------------------------
# Financial Risk Prediction
# ---------------------------
def predict_financial_risk(input_data):
    # Model expects 23 features, but we only have 4 from frontend.
    # Pad with zeros to prevent shape mismatch error.
    expected_features = 23
    current_features = len(input_data)
    
    if current_features < expected_features:
        # Pad with zeros
        padded_data = input_data + [0] * (expected_features - current_features)
        input_array = np.array(padded_data).reshape(1, -1)
    else:
        input_array = np.array(input_data).reshape(1, -1)
        
    probability = model.predict_proba(input_array)[0][1]
    prediction = model.predict(input_array)[0]
    return float(probability), int(prediction)


# ---------------------------
# Green Score Calculation
# ---------------------------
# All three inputs are normalized to 0-100 so the final score is 0-100.
# renewable_usage: already 0-100 (%). waste_management: already 0-100 (mapped on frontend).
# emission_reduction: from frontend in TONS/YR — cap at 100 so it contributes 0-40 in the formula.
def calculate_green_score(renewable_usage, emission_reduction, waste_management):
    renewable = min(100, max(0, float(renewable_usage)))
    emission = min(100, max(0, float(emission_reduction)))  # cap TONS/YR so score stays 0-100
    waste = min(100, max(0, float(waste_management)))
    score = renewable * 0.4 + emission * 0.4 + waste * 0.2
    final_score = round(min(100.0, max(0.0, score)), 2)
    breakdown = {
        "renewable_usage": round(renewable, 1),
        "renewable_contribution": round(renewable * 0.4, 2),
        "emission_reduction": round(emission, 1),
        "emission_contribution": round(emission * 0.4, 2),
        "waste_management": round(waste, 1),
        "waste_contribution": round(waste * 0.2, 2),
    }
    return final_score, breakdown


# ---------------------------
# Decision Engine
# ---------------------------
def final_decision(financial_probability, green_score):
    if financial_probability < 0.3:
        risk_level = "Low"
    elif financial_probability < 0.6:
        risk_level = "Medium"
    else:
        risk_level = "High"

    if risk_level == "Low" and green_score > 60:
        decision = "Approved with Green Incentive"
    elif risk_level == "Low":
        decision = "Approved"
    elif risk_level == "Medium" and green_score > 70:
        decision = "Conditionally Approved"
    else:
        decision = "Rejected"

    return risk_level, decision


# ---------------------------
# Interest Rate Logic
# ---------------------------
def calculate_interest_rate(financial_probability, green_score):
    base_rate = 10  # Base interest %
    risk_premium = financial_probability * 5
    green_discount = green_score * 0.02

    final_rate = base_rate + risk_premium - green_discount
    return round(final_rate, 2)


# ---------------------------
# API Route
# ---------------------------
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    financial_features = data["financial_features"]
    renewable = data["renewable"]
    emission = data["emission"]
    waste = data["waste"]

    prob, pred = predict_financial_risk(financial_features)
    green_score, green_breakdown = calculate_green_score(renewable, emission, waste)
    risk_level, decision = final_decision(prob, green_score)
    interest_rate = calculate_interest_rate(prob, green_score)

    # Meaningful data analysis for frontend
    default_pct = round(prob * 100, 2)
    analysis = {
        "green_breakdown": green_breakdown,
        "risk_drivers": [
            f"Default probability {default_pct}% (credit model)",
            f"Green score {green_score} drives rate discount: {round(green_score * 0.02, 2)}%",
            "Low risk + green > 60 → Green Incentive; Medium + green > 70 → Conditional",
        ],
        "summary": f"Financial risk is {risk_level.lower()}; sustainability score is {green_score}/100. "
                   + ("Strong ESG profile supports the decision." if green_score >= 60 else "Improving sustainability could unlock better terms."),
    }

    response_data = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "input": {
            "financial_features": financial_features,
            "renewable": renewable,
            "emission": emission,
            "waste": waste,
        },
        "result": {
            "default_probability (%)": default_pct,
            "risk_level": risk_level,
            "green_score": green_score,
            "decision": decision,
            "recommended_interest_rate (%)": interest_rate,
            "analysis": analysis,
        },
    }

    # Save to Supabase PostgreSQL if DATABASE_URL is set
    try:
        save_evaluation_to_db(
            financial_features, renewable, emission, waste,
            default_pct, risk_level, green_score, decision, interest_rate,
            analysis, response_data,
        )
    except Exception as e:
        print(f"Warning: could not save to DB: {e}")

    # Append this evaluation to JSON file (each input gives a different entry)
    RESULTS_JSON = "evaluation_results.json"
    try:
        if os.path.isfile(RESULTS_JSON):
            with open(RESULTS_JSON, "r", encoding="utf-8") as f:
                all_results = json.load(f)
        else:
            all_results = []
        all_results.append(response_data)
        with open(RESULTS_JSON, "w", encoding="utf-8") as f:
            json.dump(all_results, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Warning: could not write {RESULTS_JSON}: {e}")

    return jsonify({
        "default_probability (%)": default_pct,
        "risk_level": risk_level,
        "green_score": green_score,
        "decision": decision,
        "recommended_interest_rate (%)": interest_rate,
        "analysis": analysis,
    })





if __name__ == "__main__":
    app.run(debug=True)
