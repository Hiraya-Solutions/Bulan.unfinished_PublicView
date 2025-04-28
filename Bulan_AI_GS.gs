// This didn't work or got called at all, I'm dropping the project
function startBulan_AI_GS() {

  function GPT(input) {
  const GITHUB_TOKEN = 'EXAMPLETOKENSINCEICANTGIVEYOUMINEHAHA'; // <-- your GitHub token
  const BASE_URL = 'https://models.inference.ai.azure.com/chat/completions'; // Correct endpoint!

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${GITHUB_TOKEN}`
  };

  const payload = {
    model: "gpt-4o",
    messages: [
      { role: "system", content: "" },
      { role: "user", content: input }
    ],
    temperature: 1,
    max_tokens: 4096,
    top_p: 1
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: headers,
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(BASE_URL, options);
    const json = JSON.parse(response.getContentText());

    if (json.choices && json.choices.length > 0) {
      return json.choices[0].message.content;
    } else if (json.error) {
      return "API Error: " + json.error.message;
    } else {
      return "Unexpected response: " + JSON.stringify(json);
    }
  } catch (e) {
    return "Error: " + e.toString();
  }
}
  SpreadsheetApp.getUi().alert('AI function =GPT(Cell) is in effect!');
}
