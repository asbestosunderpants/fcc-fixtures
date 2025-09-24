const sheetID = "1ezaXLDNtISfr36vZcuso1YNSgvR8lNn7d3yL19J8n8w";   // Google Sheet ID
const apiKey = "AIzaSyDD3XZ-lH9-a36TSmKNL-NBUYsNl_rzcgI";     // Google API key

fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/data?key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    const fixtures = data.values.slice(1); // skip header
    const tbody = document.querySelector("#fixturesTable tbody");
    const calendarEvents = [];

    fixtures.forEach(row => {
      const [date, time, type, team, opponent, eventName, location, notes] = row;

      // Table row
      const tr = document.createElement("tr");
      tr.className = type.toLowerCase(); // match or function

      tr.innerHTML = `
        <td>${date}</td>
        <td>${time}</td>
        <td>${type}</td>
        <td>${team || '-'}</td>
        <td>${opponent || '-'}</td>
        <td>${eventName || '-'}</td>
        <td>${location || '-'}</td>
        <td>${notes || '-'}</td>
        <td>
          <a href="https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(type === 'Match' ? type+': '+team+' vs '+opponent : type+': '+eventName)}&dates=${date.replace(/-/g,'')}T${time.replace(':','')}00/${date.replace(/-/g,'')}T${time.replace(':','')}00&location=${encodeURIComponent(location)}&details=${encodeURIComponent(notes)}" target="_blank">Add</a>
        </td>
      `;

      tbody.appendChild(tr);

      // Calendar event
      calendarEvents.push({
        title: type === 'Match' ? `${type}: ${team} vs ${opponent}` : `${type}: ${eventName}`,
        start: `${date}T${time}`,
        end: new Date(new Date(`${date}T${time}`).getTime() + 3*60*60*1000).toISOString()
      });
    });

    // FullCalendar
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      events: calendarEvents
    });
    calendar.render();
  })
  .catch(err => console.error(err));

