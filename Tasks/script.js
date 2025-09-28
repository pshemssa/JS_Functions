document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const taskNameInput = document.getElementById("taskName");
  const dueDateInput = document.getElementById("dueDate");
  const taskList = document.getElementById("taskList");
  const clearAllBtn = document.getElementById("clearAll");
  const filterSelect = document.getElementById("filter");

  // Add error message element under form
  const errorMessage = document.createElement("p");
  errorMessage.className = "text-red-500 text-sm mt-2 hidden";
  taskForm.parentNode.appendChild(errorMessage);

  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Render tasks
  function renderTasks(filter = "all") {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
      if (
        (filter === "pending" && task.status !== "Pending") ||
        (filter === "completed" && task.status !== "Completed")
      ) return;

      const li = document.createElement("li");
      li.className =
        "flex items-start sm:items-center justify-between gap-3 p-3 border rounded-md bg-white";

      li.innerHTML = `
        <div class="flex items-start gap-3">
          <input type="checkbox" class="mt-1 task-toggle" ${task.status === "Completed" ? "checked" : ""}>
          <div>
            <div class="task-name font-medium ${task.status === "Completed" ? "task-completed" : ""}">${task.name}</div>
            <div class="text-xs text-slate-500 mt-1">Due: <span class="task-due">${task.dueDate}</span> • 
              <span class="task-status text-xs ${task.status === "Completed" ? "text-green-600": "text-orange-600" }">${task.status}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 items-center">
          <button class="edit-btn text-sky-600 text-sm hover:underline">Edit</button>
          <button class="delete-btn text-rose-600 text-sm hover:underline">Delete</button>
        </div>
      `;

      // Toggle complete
      const checkbox = li.querySelector(".task-toggle");
      const statusSpan = li.querySelector(".task-status");
      const nameDiv = li.querySelector(".task-name");

      checkbox.addEventListener("change", () => {
        task.status = checkbox.checked ? "Completed" : "Pending";
        saveTasks();
        renderTasks(filterSelect.value);
      });

      // Delete
      li.querySelector(".delete-btn").addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks(filterSelect.value);
      });

     
      li.querySelector(".edit-btn").addEventListener("click", () => {
        taskNameInput.value = task.name;
        dueDateInput.value = task.dueDate;
        tasks.splice(index, 1); 
        saveTasks();
        renderTasks(filterSelect.value);
      });

      taskList.appendChild(li);
    });
  }

  
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskName = taskNameInput.value.trim();
    const dueDate = dueDateInput.value;

    if (!taskName || !dueDate) {
      errorMessage.textContent = "Please enter both task name and due date.";
      errorMessage.classList.remove("hidden");
      return;
    } else {
      errorMessage.classList.add("hidden");
    }

    tasks.push({ name: taskName, dueDate: dueDate, status: "Pending" });
    saveTasks();
    renderTasks(filterSelect.value);

    taskForm.reset();
  });


  filterSelect.addEventListener("change", () => {
    renderTasks(filterSelect.value);
  });

 
  clearAllBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to clear all tasks?")) {
      tasks = [];
      saveTasks();
      renderTasks();
    }
  });

  // Initial render
  renderTasks();
});
