document.addEventListener("DOMContentLoaded", function () {
  const taskForm = document.getElementById("todo-form");
  const taskInput = document.getElementById("task-input");
  const priorityInput = document.getElementById("priority-input");
  const taskList = document.getElementById("task-list");
  const clearListBtn = document.getElementById("clear-list");

  fetch("/tasks")
    .then((response) => response.json())
    .then((tasks) => {
      tasks.forEach((task) => addTaskToDOM(task));
    });

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    const priority = priorityInput.value;
    if (taskText !== "") {
      fetch("/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskText, priority: priority }),
      })
        .then((response) => response.json())
        .then((task) => addTaskToDOM(task));
      taskInput.value = "";
    }
  });

  clearListBtn.addEventListener("click", function () {
    fetch("/clear", { method: "POST" }).then(() => (taskList.innerHTML = ""));
  });

  function addTaskToDOM(task) {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");
    const taskTitle = document.createElement("h3");
    taskTitle.textContent = task.task;
    taskCard.appendChild(taskTitle);
    const priorityBadge = document.createElement("span");
    priorityBadge.textContent =
      task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    priorityBadge.classList.add("priority", task.priority);
    taskCard.appendChild(priorityBadge);
    const datesSection = document.createElement("div");
    datesSection.classList.add("dates");
    datesSection.innerHTML = `<strong>Created At:</strong> ${new Date(
      task.created_at
    ).toLocaleString()}<br><strong>Deadline:</strong> ${new Date(
      task.deadline
    ).toLocaleString()}`;
    taskCard.appendChild(datesSection);
    taskList.appendChild(taskCard);
  }
});
