const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const FILE = path.join(__dirname, 'tasks.json');

app.use(cors());
app.use(express.json());

function readTasks() {
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]');
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

function writeTasks(tasks) {
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

app.get('/api/tasks', (req, res) => {
  res.json(readTasks());
});

app.post('/api/tasks', (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now(),
    text: req.body.text,
    completed: false
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id/toggle', (req, res) => {
  const tasks = readTasks();
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    writeTasks(tasks);
    res.json(task);
  } else {
    res.status(404).send({ error: 'Завдання не знайдено' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  let tasks = readTasks();
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  writeTasks(tasks);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущено: http://localhost:${PORT}`);
});
