// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    // Fetch existing tasks when the page loads
    fetchTasks();

    // Add a new task
    taskForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const task = taskInput.value.trim();

        if (task) {
            await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ task })
            });
            taskInput.value = ''; // Clear the input field
            fetchTasks(); // Reload the task list
        }
    });

    // Fetch all tasks and display them
    async function fetchTasks() {
        const response = await fetch('/tasks');
        const tasks = await response.json();

        // Clear the current task list
        taskList.innerHTML = '';

        // First, render incomplete tasks
        tasks
            .filter(task => !task.completed)
            .forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span style="text-decoration: none">${task.task}</span>
                    <div class="buttons">
                        <button onclick="completeTask(${task.id})">Complete</button>
                        <button onclick="deleteTask(${task.id})">Delete</button>
                    </div>
                `;
                taskList.appendChild(li);
            });

        // Then, render completed tasks
        tasks
            .filter(task => task.completed)
            .forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span style="text-decoration: line-through">${task.task}</span>
                    <div class="buttons">
                        <button onclick="completeTask(${task.id})">Incomplete</button>
                        <button onclick="deleteTask(${task.id})">Delete</button>
                    </div>
                `;
                taskList.appendChild(li);
            });
    }

    // Mark a task as complete/incomplete
    window.completeTask = async function(id) {
        await fetch(`/tasks/${id}`, {
            method: 'PUT'
        });
        fetchTasks(); // Reload the task list
    }

    // Delete a task
    window.deleteTask = async function(id) {
        await fetch(`/tasks/${id}`, {
            method: 'DELETE'
        });
        fetchTasks(); // Reload the task list
    }
});