const addTaskBtn = document.getElementById('addTaskBtn');
const taskTitleInput = document.getElementById('taskTitle');
const taskTimeInput = document.getElementById('taskTime');
const taskList = document.getElementById('taskList');

// Load tasks from localStorage
window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(task => createTaskElement(task.title, task.time));
};

function saveTask(title, time) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ title, time });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(title, time) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(t => t.title !== title || t.time !== time);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(title, time) {
  const li = document.createElement('li');

  const infoDiv = document.createElement('div');
  infoDiv.className = 'task-info';

  const titleEl = document.createElement('span');
  titleEl.textContent = title;

  const countdownEl = document.createElement('span');
  countdownEl.className = 'countdown';
  countdownEl.dataset.time = time;

  infoDiv.appendChild(titleEl);
  infoDiv.appendChild(countdownEl);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '✖';
  deleteBtn.className = 'delete-btn';
  deleteBtn.onclick = () => {
    taskList.removeChild(li);
    deleteTask(title, time);
  };

  li.appendChild(infoDiv);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

addTaskBtn.addEventListener('click', () => {
  const title = taskTitleInput.value.trim();
  const time = taskTimeInput.value;

  if (title && time) {
    createTaskElement(title, time);
    saveTask(title, time);
    taskTitleInput.value = '';
    taskTimeInput.value = '';
  }
});

function updateCountdowns() {
  const now = new Date();
  document.querySelectorAll('.countdown').forEach(el => {
    const targetTime = new Date(el.dataset.time);
    const diff = targetTime - now;

    if (diff <= 0) {
      el.textContent = '⏰ Time reached!';
      el.parentElement.classList.add('expired');
    } else {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      el.textContent = `⏳ ${hours}h ${minutes}m ${seconds}s left`;
    }
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log('Service Worker registered:', reg))
    .catch(err => console.error('Service Worker registration failed:', err));
}

Notification.requestPermission().then(permission => {
  if (permission === "granted") {
    console.log("Notifications allowed");
  }
});

setInterval(updateCountdowns, 1000);
