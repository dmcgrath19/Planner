const fs = require('fs');
const path = require('path');

document.addEventListener('DOMContentLoaded', () => {
  const calendarEl = document.getElementById('calendar');

  const taskFilePath = path.join(__dirname, '..', 'data', 'tasks.json');
  const tasks = fs.existsSync(taskFilePath)
    ? JSON.parse(fs.readFileSync(taskFilePath))
    : [];

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayStr = now.toISOString().split('T')[0];

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

  const numCells = (startDayOfWeek + totalDays > 35) ? 42 : 35;


  let dayCounter = 1;
  for (let i = 0; i < numCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'day';

    const inMonth = i >= startDayOfWeek && dayCounter <= totalDays;
    if (inMonth) {
      const date = new Date(year, month, dayCounter);
      const iso = date.toISOString().split('T')[0];

      if (iso === todayStr) {
        cell.classList.add('today');
      }

      const label = document.createElement('div');
      label.textContent = dayCounter;
      label.style.fontWeight = 'bold';
      cell.appendChild(label);

      tasks.forEach(task => {
        const taskDate = task.deadline.split('T')[0];
        if (taskDate === iso) {
          const event = document.createElement('div');
          event.className = 'event';
          event.textContent = task.name;
          cell.appendChild(event);
        }
      });

      dayCounter++;
    }

    calendarEl.appendChild(cell);
  }
});
