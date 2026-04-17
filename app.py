from flask import Flask, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

# Load model (local file) or use stub if missing/incompatible
MODEL_PATH = "credit_default_model.pkl"
model = None

try:
    if os.path.isfile(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"Loaded model from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}. Using StubModel.")

if model is None:
    # Stub model when .pkl is missing or incompatible
    class StubModel:
        def predict(self, X):
            p = self.predict_proba(X)
            return np.array([0 if p[i, 1] < 0.5 else 1 for i in range(len(X))])
        def predict_proba(self, X):
            n = len(X)
            # Default probability based on first feature (annual revenue) and second (credit score - if available)
            # Note: The input shape depends on what frontend sends. 
            # predict_financial_risk assumes input_data is a list which is reshaped to (1, -1)
            probs = []
            for i in range(n):
                # Assuming features: [annual_revenue, years_in_business, loan_amount, ...]
                rev = float(X[i, 0]) if X.shape[1] > 0 else 0
                # Using simple heuristic: higher revenue -> lower risk
                # Base prob of default 0.5, reduce by revenue
                p_default = max(0.05, 0.5 - (rev / 1000000) * 0.1) 
                probs.append([1 - p_default, p_default])
            return np.array(probs)
    model = StubModel()
    print("Initialized StubModel")


# ---------------------------
# Financial Risk Prediction
# ---------------------------
def predict_financial_risk(input_data):
    input_array = np.array(input_data).reshape(1, -1)
    probability = model.predict_proba(input_array)[0][1]
    prediction = model.predict(input_array)[0]
    return float(probability), int(prediction)


# ---------------------------
# Green Score Calculation
# ---------------------------
def calculate_green_score(renewable_usage, emission_reduction, waste_management):
    score = (
        renewable_usage * 0.4 +
        emission_reduction * 0.4 +
        waste_management * 0.2
    )
    return round(score, 2)


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
    green_score = calculate_green_score(renewable, emission, waste)
    risk_level, decision = final_decision(prob, green_score)
    interest_rate = calculate_interest_rate(prob, green_score)

    return jsonify({
        "default_probability (%)": round(prob * 100, 2),
        "risk_level": risk_level,
        "green_score": green_score,
        "decision": decision,
        "recommended_interest_rate (%)": interest_rate
    })


if __name__ == "__main__":
    app.run(debug=True)
