const fs = require('fs');
const path = require('path');

const taskFilePath = path.join(__dirname, '..', 'data', 'tasks.json');

document.getElementById('task-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('task-name').value;
  const duration = parseFloat(document.getElementById('task-duration').value);
  const deadline = document.getElementById('task-deadline').value;

  const newTask = {
    name,
    duration,
    deadline,
    createdAt: new Date().toISOString(),
    remainingTime: duration * 60 // store time in seconds
  };

  // Load existing tasks
  let tasks = [];
  if (fs.existsSync(taskFilePath)) {
    tasks = JSON.parse(fs.readFileSync(taskFilePath));
  }

  tasks.push(newTask);

  // Save updated list
  fs.writeFileSync(taskFilePath, JSON.stringify(tasks, null, 2));

  // Refresh task list
  renderTasks(tasks);

  // Show a native notification
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

  // Clear form
  e.target.reset();
});

function renderTasks(tasks) {
  const list = document.getElementById('task-list');
  list.innerHTML = ''; // Clear existing task list
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = `${task.name} – ${task.duration}h – due ${task.deadline}`;

    // Create a button to start the timer
    const startButton = document.createElement('button');
    startButton.textContent = 'Start Timer';
    startButton.addEventListener('click', () => startTimer(task, index));

    const timerDisplay = document.createElement('span');
    timerDisplay.id = `timer-${index}`;
    timerDisplay.textContent = `Time remaining: ${formatTime(task.remainingTime)}`;

    li.appendChild(startButton);
    li.appendChild(timerDisplay);
    list.appendChild(li);
  });
}

function startTimer(task, index) {
  const timerDisplay = document.getElementById(`timer-${index}`);

  const interval = setInterval(() => {
    if (task.remainingTime > 0) {
      task.remainingTime--;
      timerDisplay.textContent = `Time remaining: ${formatTime(task.remainingTime)}`;
    } else {
      clearInterval(interval);
      new Notification(`Task "${task.name}" complete!`, {
        body: `You finished your task! Well done.`
      });
    }
  }, 1000);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

// Load tasks on startup
if (fs.existsSync(taskFilePath)) {
  const savedTasks = JSON.parse(fs.readFileSync(taskFilePath));
  renderTasks(savedTasks);
} else {
  // If there are no saved tasks, create an empty task array
  renderTasks([]);
}
