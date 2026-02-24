const API_URL = "https://dsa-refresh.vercel.app/api/problems";

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0]?.url || "";
  document.getElementById("url").value = url;

  const match = url.match(/problems\/([^/]+)/);
  if (match) {
    const name = match[1]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    document.getElementById("name").value = name;
  }
});

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const button = document.getElementById("submit-btn");
  const status = document.getElementById("status");

  const name = document.getElementById("name").value.trim();
  const url = document.getElementById("url").value.trim();
  const difficulty = document.getElementById("difficulty").value;
  const remindInDays = parseInt(document.getElementById("days").value);

  if (!name || !url || !difficulty || isNaN(remindInDays)) {
    showStatus("Please fill in all fields", "error");
    return;
  }

  button.disabled = true;
  button.textContent = "Saving...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        link: url,
        difficulty: difficulty,
        remind_in_days: remindInDays,
      }),
    });
    console.log("Response status:", response.status);
    if (!response.ok) {
      throw new Error("Failed to save");
    }

    showStatus("Problem saved! ✓", "success");

    // Reset form (except URL)
    document.getElementById("name").value = "";
    document.getElementById("difficulty").value = "";
    document.getElementById("days").value = "";
  } catch (err) {
    showStatus("Failed to save. Is the server running?", "error");
  } finally {
    button.disabled = false;
    button.textContent = "Save Problem";
  }
});

function showStatus(message, type) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.className = "status";
  status.classList.add(`status--${type}`);

  setTimeout(() => {
    status.className = "status";
  }, 3000);
}
