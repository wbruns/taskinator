// for referencing task id's
var taskIdCounter = 0;
// reference to form
var formEl = document.querySelector("#task-form");
// reference to "tasks to do" ul
var tasksToDoEl = document.querySelector("#tasks-to-do");
// reference to tasks in progress list
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
// reference to tasks completed list
var tasksCompletedEl = document.querySelector("#tasks-completed");
// reference to <main>
var pageContentEl = document.querySelector("#page-content");

// controls the form
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

  // check to see if we are editing or creating a task
  var isEdit = formEl.hasAttribute("data-task-id");
  
  // has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    // package data as an object
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput
    };
    // send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
  }
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

// dynamically create buttons/status select
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

// finish editing a task
var completeEditTask = function(taskName, taskType, taskId) {
  // find the matching task list item
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  alert("Task Updated!");

  // remove data-task-id so form can create new tasks again
  formEl.removeAttribute("data-task-id");
  // change text on the form button back
  document.querySelector("#save-task").textContent = "Add Task";
};

// when a button is clicked
var taskButtonHandler = function(event) {
  // get target element from event
  var targetEl = event.target;

  // if edit button is clicked
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
  // delete button was clicked
  if (targetEl.matches(".delete-btn")) {
    // get the button's task id
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

// when there is a change in task status
var taskStatusChangeHandler = function(event) {
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase
  // lowercase is futureproofing in case we change how status text is displayed
  var statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // move the task
  if (statusValue === "to do") {
    // move to To Do column
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    // move to In Progress column
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    // move to Completed column
    tasksCompletedEl.appendChild(taskSelected);
  }
};

// send off info for the task we are editing
var editTask = function(taskId) {
  // get task list item element
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;
  
  // put content back into the form
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  // change text of the button
  document.querySelector("#save-task").textContent = "Save Task";

  // set a data-task-id on the form
  formEl.setAttribute("data-task-id", taskId);
};

// remove a task
var deleteTask = function(taskId) {
  // finds the list element with a class of .task-item AND attribute data-task-id
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();
};

// submit event is form specific, activates when enter is pressed or when a 
// button with type="submit" within the form is pressed
// create a new task
formEl.addEventListener("submit", taskFormHandler);
// click event for <main> (edit and delete buttons)
pageContentEl.addEventListener("click", taskButtonHandler);
// change event for task status
pageContentEl.addEventListener("change", taskStatusChangeHandler);