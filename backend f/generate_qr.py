import qrcode
import json
import os

# Define the payload matching the frontend/backend requirements
payload = {
  "type": "ECOCRED Evaluation Certificate",
  "financial": {
    "annualRevenue": 5000000,
    "yearsInBusiness": 8,
    "loanAmount": 500000
  },
  "sustainability": {
    "renewableEnergyUsage": 45,
    "estimatedCarbonReduction": 250,
    "wasteManagement": "B-Advanced",
    "wasteScore": 70
  }
}

# Convert to JSON string
data = json.dumps(payload)

# Generate QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(data)
qr.make(fit=True)

# Create an image from the QR Code instance
img = qr.make_image(fill_color="black", back_color="white")

# Save the image
output_path = "test_qr_code.png"
img.save(output_path)

print(f"QR code generated successfully at: {os.path.abspath(output_path)}")
print(f"Payload encoded: {data}")
