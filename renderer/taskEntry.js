const flatpickr = require("flatpickr");
const fs = require('fs');
const path = require('path');

const taskFilePath = path.join(__dirname, '..', 'data', 'tasks.json');
let timers = {}; // Stores interval IDs and paused states

document.addEventListener("DOMContentLoaded", () => {
  // Initialize flatpickr
  flatpickr("#task-deadline", {
    minDate: "today",
    defaultDate: "today",
    dateFormat: "d-m-Y"
  });

  // Add toggle button above the form
  const app = document.getElementById('app');
  const taskAdder = document.getElementById('task-form').parentElement; // the div containing the form

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = 'Add Task ▼';
  toggleBtn.style.marginBottom = '1em';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.type = 'button'; // prevent form submit on toggle button

  app.insertBefore(toggleBtn, taskAdder);

  toggleBtn.addEventListener('click', () => {
    const computedDisplay = window.getComputedStyle(taskAdder).display;
    if (computedDisplay === 'none') {
      taskAdder.style.display = 'block';
      toggleBtn.textContent = 'Add Task ▲';
    } else {
      taskAdder.style.display = 'none';
      toggleBtn.textContent = 'Add Task ▼';
    }
  });

  // Optionally start with form minimized:
  // taskAdder.style.display = 'none';

  // Load and render saved tasks
  if (fs.existsSync(taskFilePath)) {
    const savedTasks = JSON.parse(fs.readFileSync(taskFilePath));
    renderTasks(savedTasks);
  } else {
    renderTasks([]);
  }
});

document.getElementById('task-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('task-name').value;
  const duration = parseFloat(document.getElementById('task-duration').value);
  const deadline = document.getElementById('task-deadline').value; // dd-mm-yyyy string
  
  const [day, month, year] = deadline.split('-').map(Number);
  const deadlineDate = new Date(year, month - 1, day);
  deadlineDate.setHours(0, 0, 0, 0);

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  if (deadlineDate < todayDate) {
    alert('Please select today or a future date.');
    return;
  }

  const newTask = {
    name,
    duration,
    deadline,  // save string date here, not Date object
    createdAt: new Date().toISOString(),
    remainingTime: duration * 60,
    isPaused: true
  };

  let tasks = [];
  if (fs.existsSync(taskFilePath)) {
    tasks = JSON.parse(fs.readFileSync(taskFilePath));
  }

  tasks.push(newTask);
  fs.writeFileSync(taskFilePath, JSON.stringify(tasks, null, 2));
  renderTasks(tasks);

  if (Notification.permission === 'granted') {
    new Notification('Task Added', {
      body: `Task "${newTask.name}" added. Due ${newTask.deadline}.`
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Task Added', {
          body: `Task "${newTask.name}" added. Due ${newTask.deadline}.`
        });
      }
    });
  }

  e.target.reset();
});

function renderTasks(tasks) {
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    const taskText = document.createElement('span');
    taskText.textContent = `${task.name} – ${task.duration}h – due ${task.deadline}`;
    taskText.className = 'task-name';

    const timerDisplay = document.createElement('span');
    timerDisplay.id = `timer-${index}`;
    timerDisplay.textContent = `Time remaining: ${formatTime(task.remainingTime)}`;
    timerDisplay.className = 'task-meta';

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Start';
    toggleButton.addEventListener('click', () => toggleTimer(task, index, toggleButton));

    const container = document.createElement('div');
    container.className = 'task-info';
    container.appendChild(taskText);
    container.appendChild(timerDisplay);

    li.appendChild(container);
    li.appendChild(toggleButton);
    list.appendChild(li);
  });

  fs.writeFileSync(taskFilePath, JSON.stringify(tasks, null, 2));
}

function toggleTimer(task, index, button) {
  const timerDisplay = document.getElementById(`timer-${index}`);

  if (timers[index] && timers[index].intervalId) {
    clearInterval(timers[index].intervalId);
    timers[index] = { ...timers[index], intervalId: null };
    button.textContent = 'Start';
  } else {
    const intervalId = setInterval(() => {
      if (task.remainingTime > 0) {
        task.remainingTime--;
        timerDisplay.textContent = `Time remaining: ${formatTime(task.remainingTime)}`;
        saveTaskState(index, task);
      } else {
        clearInterval(intervalId);
        button.disabled = true;
        new Notification(`Task "${task.name}" complete!`, {
          body: `You finished your task! Well done.`
        });
      }
    }, 1000);

    timers[index] = { intervalId };
    button.textContent = 'Pause';
  }
}

function saveTaskState(index, task) {
  let tasks = JSON.parse(fs.readFileSync(taskFilePath));
  tasks[index] = task;
  fs.writeFileSync(taskFilePath, JSON.stringify(tasks, null, 2));
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
}
