const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const clearBtn = document.getElementById("clearBtn");
const themeToggle = document.getElementById("themeToggle");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks.filter((t) => {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "completed") return t.done;
    return true;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.done ? "completed" : "";
    li.innerHTML = `
      <span>${task.text}</span>
      <div class="details">
        <span class="priority ${task.priority}">${task.priority}</span>
        <span>${task.date || ""}</span>
      </div>
      <div class="actions">
        <button class="doneBtn">✓</button>
        <button class="deleteBtn">✗</button>
      </div>
    `;

    li.querySelector(".doneBtn").addEventListener("click", () => {
      task.done = !task.done;
      saveTasks();
      renderTasks();
    });

    li.querySelector(".deleteBtn").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });
}

// Add new task
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const date = taskDate.value;
  const priority = taskPriority.value;
  if (text === "") return;
  tasks.push({ text, date, priority, done: false });
  taskInput.value = "";
  taskDate.value = "";
  saveTasks();
  renderTasks();
});

// Clear all
clearBtn.addEventListener("click", () => {
  if (confirm("Delete all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

// Filters
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  localStorage.setItem("todo-theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Load theme from storage
if (localStorage.getItem("todo-theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

renderTasks();
