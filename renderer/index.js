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
    createdAt: new Date().toISOString()
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
  list.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = `${task.name} – ${task.duration}h – due ${task.deadline}`;
    list.appendChild(li);
  });
}

// Load tasks on startup
if (fs.existsSync(taskFilePath)) {
  const savedTasks = JSON.parse(fs.readFileSync(taskFilePath));
  renderTasks(savedTasks);
}
