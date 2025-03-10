// script.js
class Task {
    constructor(id, title, completed = false) {
      this.id = id;
      this.title = title;
      this.completed = completed;
      this.createdAt = new Date();
    }
  }
  
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const filters = document.getElementById('filters');
  
  let tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Load tasks from localStorage
  
  function renderTasks(filter = 'all') {
      taskList.innerHTML = ''; // Clear the list
  
      let filteredTasks = tasks;
      if (filter === 'active') {
          filteredTasks = tasks.filter(task => !task.completed);
      } else if (filter === 'completed') {
          filteredTasks = tasks.filter(task => task.completed);
      }
  
      filteredTasks.forEach(task => {
          const li = document.createElement('li');
          li.innerHTML = `
              <input type="checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
              <span class="${task.completed ? 'completed' : ''}">${task.title}</span>
              <button data-id="${task.id}">Delete</button>
          `;
          taskList.appendChild(li);
      });
  }
  
  function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  
  taskForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const title = taskInput.value.trim();
      if (title !== '') {
          const newTask = new Task(Date.now(), title); // Use Date.now() for a simple ID
          tasks.push(newTask);
          saveTasks();
          renderTasks();
          taskInput.value = '';
      }
  });
  
  taskList.addEventListener('click', function(e) {
      if (e.target.tagName === 'BUTTON') {
          const id = parseInt(e.target.dataset.id);
          tasks = tasks.filter(task => task.id !== id); // Remove the task
          saveTasks();
          renderTasks();
      } else if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
          const id = parseInt(e.target.dataset.id);
          const task = tasks.find(task => task.id === id);
          if (task) {
              task.completed = !task.completed;
              saveTasks();
              renderTasks();
          }
      }
  });
  
  filters.addEventListener('click', function(e) {
      if (e.target.tagName === 'BUTTON') {
          const filter = e.target.dataset.filter;
  
          //Remove active class from all buttons
          document.querySelectorAll('#filters button').forEach(button => button.classList.remove('active'));
          e.target.classList.add('active'); // Add active class to the current filter button
  
          renderTasks(filter);
      }
  });
  
  // Initial render
  renderTasks();