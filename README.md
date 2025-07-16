# Sentiment Checker Chrome Extension with Flask AI Backend

This project integrates a **Chrome extension** with a **Python Flask backend** that uses an AI model (from HuggingFace Transformers) to analyze the **sentiment of highlighted text** on any webpage.

You can:
- Select any text on a website
- Right-click → Check Sentiment
- See a notification popup showing whether it’s Positive or Negative 💬

---

## Features

✅ Chrome context menu integration  
✅ Text selection support  
✅ AI sentiment analysis via `transformers` pipeline  
✅ Notifications using Chrome APIs  
✅ Backend with Flask + HuggingFace  
✅ Full-stack integration of extension + Python ML model  

---

## Project Structure

sentiment-extension-ai/
├── backend/              # Flask AI Server  
│   ├── app.py  
│   ├── sentiment_model.pkl  
│   ├── vectorizer.pkl  
│   ├── templates/  
│   │   └── index.html  
│   └── requirements.txt  
│  
├── extension/            # Chrome Extension  
│   ├── background.js  
│   ├── manifest.json  
│   ├── icon.png  
│   └── popup.html (optional)  
│  
└── README.md

---

## Flask Backend Setup

###  1. Install Dependencies

pip install flask flask-cors transformers joblib nltk

###  2. Download NLTK data

Run this once:

import nltk  
nltk.download('punkt')  
nltk.download('stopwords')  
nltk.download('wordnet')

###  3. Run Flask App

Navigate to `backend/` folder and run:

python app.py

App will run at `http://127.0.0.1:5000`

---

##  AI Model Used

We use Hugging Face's sentiment analysis pipeline:

from transformers import pipeline  
sentiment_pipeline = pipeline("sentiment-analysis")

You can replace this with your own fine-tuned model or local transformer for offline use.

---

##  Chrome Extension Setup

###  1. `manifest.json`

Ensure `"permissions"` and `"host_permissions"` include:

"permissions": [
  "activeTab",
  "scripting",
  "contextMenus",
  "notifications"
],
"host_permissions": [
  "<all_urls>"
]

###  2. `background.js`

- Adds a right-click context menu  
- Sends selected text to Flask backend (`http://127.0.0.1:5000/predict`)  
- Shows result using `chrome.notifications`

---

##  Test Steps

1. **Start Flask backend**: `python app.py`  
2. **Go to Chrome** → `chrome://extensions`  
3. Enable **Developer mode**  
4. Click **Load unpacked** → select the `extension/` folder  
5. Open any website  
6. Select a sentence or phrase  
7. Right-click → **Check Sentiment**  
8. You’ll get a desktop **notification popup** (e.g., *Positive* or *Negative*)

---

##  Troubleshooting

###  Not seeing the notification?

- Make sure Chrome is allowed in Windows notification settings  
- Check the `icon.png` path and size (use 48x48 PNG)  
- Use `console.log` + `chrome.runtime.lastError` to debug  
- Test with hardcoded message first  
- Check that Flask is running and CORS is enabled

---

##  To Deploy Flask Backend (Optional)

You can deploy the Flask server to:
- Railway: https://railway.app/
- Render: https://render.com/
- Replit: https://replit.com/
- PythonAnywhere or VPS

Update `background.js` to point to your live backend URL like:

fetch("https://your-deployed-url.com/predict", {...})

---

## 👩‍💻 Built With

- Python  
- Flask  
- HuggingFace Transformers  
- NLTK  
- Chrome Extension APIs

---

##  Author

👩‍💻 Dharsini Balakumaar  
💬 https://github.com/DharsiniBalakumaar

---

##  Future Improvements

- [ ] Show confidence score in popup  
- [ ] Add text-to-speech (TTS) for reading sentiment aloud  
- [ ] Deploy backend to cloud  
- [ ] Save checked history using `chrome.storage`  
- [ ] Add sarcastic text detection  

---

##  Demo

📸 Screenshot 1: Selecting text → right-click → Check Sentiment  

<img width="1325" height="497" alt="image" src="https://github.com/user-attachments/assets/bf2bdfa3-9ab3-41e3-9fae-3706c543e326" />

📸 Screenshot 2: Notification saying “Sentiment: Positive”

<img width="600" height="207" alt="image" src="https://github.com/user-attachments/assets/c35e36ea-5178-4b89-8cca-6c316bbf1500" />

---

