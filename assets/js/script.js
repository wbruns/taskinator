// reference to form
var formEl = document.querySelector("#task-form");
// reference to "tasks to do" ul
var tasksToDoEl = document.querySelector("#tasks-to-do");
// for referencing task id's
var taskIdCounter = 0;
// reference to <main>
var pageContentEl = document.querySelector("#page-content");

var taskFormHandler = function(event) {
// prevents the page from reloading
  event.preventDefault();

  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
  // check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  };
  // reset data in form
  formEl.reset();
  // package data as an object
  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput
  };
  // send it as an argument to createTaskEl
  createTaskEl(taskDataObj);
};

// function to create html elements and add them to the list as a new task
var createTaskEl = function(taskDataObj) {
  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  // give it a class name
  taskInfoEl.className = "task-info";
  // add HTML content to div
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  // create button call
  var taskActionsEl = createTaskActions(taskIdCounter);
  // add them to li item
  listItemEl.appendChild(taskActionsEl);


  // add entire li item to ul
  tasksToDoEl.appendChild(listItemEl);

  // increase task counter for next unique id
  taskIdCounter++;
};

// dynamically create buttons
var createTaskActions = function(taskId) {
  // create a container 
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  // create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  // task status dropdown menu
  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  // add options to statusSelectEl
  var statusChoices = ["To Do", "In Progress", "Completed"];
  for (var i=0; i < statusChoices.length; i++) {
    //create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);

    //append to select
    statusSelectEl.appendChild(statusOptionEl);
  };

  actionContainerEl.appendChild(statusSelectEl);

  return actionContainerEl;
};

// submit event is form specific, activates when enter is pressed or when a 
// button with type="submit" within the form is pressed
formEl.addEventListener("submit", taskFormHandler);

var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();
};

var taskButtonHandler = function(event) {
  console.log(event.target);

  if (event.target.matches(".delete-btn")) {
    // get the button's task id
    var taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

pageContentEl.addEventListener("click", taskButtonHandler);