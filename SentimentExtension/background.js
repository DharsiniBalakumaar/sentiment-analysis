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

      console.log("Sending to Flask:", selectedText);  // ✅

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText })
      });

      const data = await response.json();

      try {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png",
    title: "Sentiment Result",
    message: `The sentiment is: ${data.sentiment}`
  }, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error("Notification Error:", chrome.runtime.lastError.message);
    } else {
      console.log("Notification shown:", notificationId);
    }
  });
} catch (e) {
  console.error("Exception in notification:", e);
}

    });
  }
});
