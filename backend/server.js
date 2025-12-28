const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data file path
const DATA_FILE = path.join(__dirname, 'tasks.json');

// Initialize tasks file if doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]');
}

// Helper function to read tasks
const readTasks = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write tasks
const writeTasks = (tasks) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};

// ==================== CRUD ENDPOINTS ====================

// GET all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// GET single task by ID
app.get('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === req.params.id);
  
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// POST create new task
app.post('/api/tasks', (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now().toString(),
    title: req.body.title,
    description: req.body.description,
    deadline: req.body.deadline,
    priority: req.body.priority || 'Medium',
    status: 'ToDo',
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// PUT update task
app.put('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const index = tasks.findIndex(t => t.id === req.params.id);
  
  if (index !== -1) {
    tasks[index] = {
      ...tasks[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    writeTasks(tasks);
    res.json(tasks[index]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  let tasks = readTasks();
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== req.params.id);
  
  if (tasks.length < initialLength) {
    writeTasks(tasks);
    res.json({ success: true, message: 'Task deleted' });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ REST API server running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints available at http://localhost:${PORT}/api/tasks`);
});