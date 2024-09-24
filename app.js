const express = require('express');
const app = express();
const path = require('path'); // Add this to work with file paths
const port = process.env.PORT || 3000;

app.use(express.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files

let tasks = [];

// Route to get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Route to add a new task
app.post('/tasks', (req, res) => {
    const { task } = req.body;
    if (task) {
        tasks.push({ id: tasks.length + 1, task, completed: false });
        res.status(201).json({ message: 'Task added successfully' });
    } else {
        res.status(400).json({ error: 'Task content is required' });
    }
});

// Route to delete a task by id
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    tasks = tasks.filter(task => task.id !== taskId);
    res.json({ message: `Task ${taskId} deleted successfully` });
});

// Route to mark a task as completed
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(task => task.id === taskId);

    if (task) {
        task.completed = !task.completed;
        res.json({ message: `Task ${taskId} marked as ${task.completed ? 'completed' : 'not completed'}` });
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

app.listen(port, () => {
    console.log(`To-Do app listening at http://localhost:${port}`);
});