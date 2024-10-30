const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const showAll = document.getElementById("showAll");
const showCompleted = document.getElementById("showCompleted");
const showPending = document.getElementById("showPending");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const renderTasks = filter => {
  taskList.innerHTML = "";
  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter(task => task.completed === (filter === "completed"));
  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.id = task.id;
    li.innerHTML = `
    <input 
      type="checkbox" ${task.completed ? "checked" : ""} 
      onchange="toggleTask(${task.id})"
    >
    <span ondblclick="editTask(${task.id})">
      ${task.text} ${task.date}
    </span>
    <div class="line-through"></div>
    <button onclick="deleteTask(${task.id})">✖</button>
          `;
    taskList.appendChild(li);
  });
};

const addTask = text => {
  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
    date: new Date().toLocaleString("uk-UA", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    })
  };
  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks("all");
};

window.toggleTask = id => {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
  const taskElement = document.getElementById(id);
  taskElement.className = tasks.find(task => task.id === id).completed
    ? "completed"
    : "";
};

window.deleteTask = id => {
  const taskElement = document.getElementById(id);
  taskElement.style.animation = "fadeOut 0.5s";
  setTimeout(() => {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks("all");
  }, 500);
};

window.editTask = id => {
  const task = tasks.find(task => task.id === id);
  const input = document.createElement("input");
  input.value = task.text;
  input.onkeypress = e => {
    if (e.key === "Enter") {
      task.text = input.value;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks("all");
    }
  };
  taskList.children[id].children[1].replaceWith(input);
  input.focus();
};

taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter" && taskInput.value.trim()) {
    addTask(taskInput.value.trim());
    taskInput.value = "";
  }
});

showAll.addEventListener("click", () => renderTasks("all"));
showCompleted.addEventListener("click", () => renderTasks("completed"));
showPending.addEventListener("click", () => renderTasks("pending"));

renderTasks("all");
