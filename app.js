const sheetID = "1ezaXLDNtISfr36vZcuso1YNSgvR8lNn7d3yL19J8n8w";
const apiKey = "AIzaSyDD3XZ-lH9-a36TSmKNL-NBUYsNl_rzcgI";

fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/data?key=${apiKey}`)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  })
  .then(data => {
    console.log("RAW API RESPONSE:", data); // <-- This will show everything the API sees

    if (!data.values) {
      console.error("No data found. Check sheet ID, tab name, and sharing settings.");
      return;
    }

    // Existing code to populate table
    const fixtures = data.values.slice(1);
    const tbody = document.querySelector("#fixturesTable tbody");

    fixtures.forEach((row, i) => {
      console.log(`Row ${i+1}:`, row); // <-- See each row
    });
  })
  .catch(err => console.error("Fetch error:", err));
