document.getElementById("analyzeBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getSelectedText" }, async (response) => {
      if (response && response.text) {
        const res = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: response.text })
        });
        const data = await res.json();
        document.getElementById("result").textContent = `Sentiment: ${data.sentiment}`;
      }
    });
  });
});
