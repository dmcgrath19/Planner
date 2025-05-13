// shared.js
const fs = require('fs');
const path = require('path');

const taskFilePath = path.join(__dirname, '..', 'data', 'tasks.json');

function loadTasks() {
  if (fs.existsSync(taskFilePath)) {
    return JSON.parse(fs.readFileSync(taskFilePath));
  }
  return [];
}

function saveTasks(tasks) {
  fs.writeFileSync(taskFilePath, JSON.stringify(tasks, null, 2));
}

module.exports = {
  loadTasks,
  saveTasks
};
