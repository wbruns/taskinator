var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function(event) {
// prevents the page from reloading
  event.preventDefault();

  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  listItemEl.textContent = "This is a new task.";
  tasksToDoEl.appendChild(listItemEl);
};

// submit event is form specific, activates when enter is pressed or when a 
// button with type="submit" within the form is pressed
formEl.addEventListener("submit", createTaskHandler);