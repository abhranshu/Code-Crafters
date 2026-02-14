from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load model (local file)
MODEL_PATH = "credit_default_model.pkl"
model = joblib.load(MODEL_PATH)


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
