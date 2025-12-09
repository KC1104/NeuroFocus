from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from attention_calculator import calculate_attention_score

app = Flask(__name__)
CORS(app)  # allows React frontend to communicate with backend

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB upload limit

@app.route('/')
def home():
    return jsonify({"message": "NeuroFocus backend is running!"})

@app.route('/analyze-frame', methods=['POST'])
def analyze_frame():
    try:
        data = request.get_json()

        # Extract incoming data
        image_base64 = data.get('image')
        study_mode = data.get('study_mode', 'Screen Work')

        if not image_base64:
            return jsonify({"error": "No image data received"}), 400

        # Compute attention score
        result = calculate_attention_score(image_base64, study_mode)

        return jsonify(result)
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Render assigns PORT automatically
    app.run(host='0.0.0.0', port=port)        # Debug mode OFF in production

