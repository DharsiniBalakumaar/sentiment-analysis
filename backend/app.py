from flask import Flask, render_template, request, jsonify
import joblib
import re
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from transformers import pipeline
from flask_cors import CORS

# Initialize
app = Flask(__name__)
CORS(app)  # For Chrome extension

# Load model and vectorizer
model = joblib.load('sentiment_model.pkl')
vectorizer = joblib.load('vectorizer.pkl')
sentiment_pipeline = pipeline("sentiment-analysis")

# Preprocessing tools
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def preprocess(text):
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-zA-Z]', ' ', text)
    text = text.lower()
    tokens = text.split()
    tokens = [lemmatizer.lemmatize(w) for w in tokens if w not in stop_words]
    return ' '.join(tokens)

# Web UI page
@app.route('/')
def home():
    return render_template('index.html')

# 🔹 Web Form: form-based POST
@app.route('/predict_form', methods=['POST'])
def predict_form():
    input_text = request.form.get('review', '')
    result = sentiment_pipeline(input_text)[0]
    sentiment = "Positive 😊" if result['label'] == 'POSITIVE' else "Negative 😢"
    return render_template('index.html', review=input_text, result=sentiment)

# 🔹 Chrome Extension: JSON-based POST
@app.route('/predict', methods=['POST'])
def predict_api():
    if request.is_json:
        data = request.get_json()
        input_text = data.get('text', '')
        result = sentiment_pipeline(input_text)[0]
        return jsonify({
            "sentiment": result['label'],
            "confidence": round(result['score'], 2)
        })
    else:
        return jsonify({"error": "Invalid request format"}), 400

if __name__ == '__main__':
    app.run(debug=True)
