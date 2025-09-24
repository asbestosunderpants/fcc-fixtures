const sheetID = "1ezaXLDNtISfr36vZcuso1YNSgvR8lNn7d3yL19J8n8w";
const apiKey = "AIzaSyDD3XZ-lH9-a36TSmKNL-NBUYsNl_rzcgI";

fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/data?key=${apiKey}`)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  })
  .then(data => {
    console.log("RAW API RESPONSE:", data);

    if (!data.values) {
      console.error("No data found. Check sheet ID, tab name, and sharing settings.");
      return;
    }

    const fixtures = data.values.slice(1); // skip header
    const tbody = document.querySelector("#fixturesTable tbody");

    fixtures.forEach((row, i) => {
      const [date, time, type, team, opponent, eventName, location, notes] = row;

      const tr = document.createElement("tr");
      tr.className = type ? type.toLowerCase() : "";

      const calendarLink = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(
        type === 'Match' ? `${type}: ${team} vs ${opponent}` : `${type}: ${eventName}`
      )}&dates=${date.replace(/\//g,'')}T${time.replace(':','')}00/${date.replace(/\//g,'')}T${time.replace(':','')}00&location=${encodeURIComponent(location || '')}&details=${encodeURIComponent(notes || '')}`;

      tr.innerHTML = `
        <td>${date || '-'}</td>
        <td>${time || '-'}</td>
        <td>${type || '-'}</td>
        <td>${team || '-'}</td>
        <td>${opponent || '-'}</td>
        <td>${eventName || '-'}</td>
        <td>${location || '-'}</td>
        <td>${notes || '-'}</td>
        <td><a href="${calendarLink}" target="_blank">Add</a></td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(err => console.error("Fetch error:", err));
