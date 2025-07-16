chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "checkSentiment",
    title: "Check Sentiment",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "checkSentiment") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const selected = window.getSelection().toString();
        console.log("Selected text:", selected);
        return selected;
      }
    }, async (injectionResults) => {
      if (!injectionResults || !injectionResults[0].result) {
        alert("No text selected or could not retrieve selection.");
        return;
      }

      const selectedText = injectionResults[0].result;
      console.log("Sending to Flask:", selectedText);

      try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: selectedText })
        });

        const data = await response.json();
        const sentiment = data.sentiment;
        const message = `The sentiment is ${sentiment.toLowerCase()}`;

        // ✅ Show Notification
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "Sentiment Result",
          message: message
        }, (notificationId) => {
          if (chrome.runtime.lastError) {
            console.error("Notification Error:", chrome.runtime.lastError.message);
          } else {
            console.log("Notification shown:", notificationId);
          }
        });

        // ✅ Speak Sentiment (TTS)
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (text) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
          },
          args: [message]
        });

      } catch (e) {
        console.error("Fetch or processing error:", e);
      }
    });
  }
});
