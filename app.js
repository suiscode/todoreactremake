// Add card doms
const todoButton = document.getElementById("todoButton");
const inProgressButton = document.getElementById("inProgressButton");
const stuckButton = document.getElementById("stuckButton");
const doneButton = document.getElementById("doneButton");

// form doms
const AddTask = document.getElementById("AddTask");
const addTaskButton = document.getElementById("addTaskButton");
const title = document.getElementById("title");
const description = document.getElementById("description");
const statusOption = document.getElementById("status");
const priorityOption = document.getElementById("priority");

AddTask.addEventListener("mousedown", (event) => {
  if (!event.target.closest(".formContainer")) {
    AddTask.classList.remove("show");
    title.value = "";
    description.value = "";
  }
});

// form containerDivs

const todoDiv = document.getElementById("todoDiv");
const inProgressDiv = document.getElementById("inProgressDiv");
const stuckDiv = document.getElementById("stuckDiv");
const doneDiv = document.getElementById("doneDiv");

// Add card OnClick

// Showing Form on click
todoButton.addEventListener("click", () => {
  AddTask.classList.add("show");
  statusOption.options[0].selected = true;
});
inProgressButton.addEventListener("click", () => {
  AddTask.classList.add("show");
  statusOption.options[1].selected = true;
});
stuckButton.addEventListener("click", () => {
  AddTask.classList.add("show");
  statusOption.options[2].selected = true;
});
doneButton.addEventListener("click", () => {
  AddTask.classList.add("show");
  statusOption.options[3].selected = true;
});

const escapeScreen = (e) => {
  if (e.key === "Escape") {
    AddTask.classList.remove("show");
    title.value = "";
    description.value = "";
  }
};

document.onkeydown = escapeScreen;

// Todo Arrays

let todoArray = [];
let editingTaskId = null;
let style = "";



todoArray = JSON.parse(localStorage.getItem("ARRAY")) == null ? [] : JSON.parse(localStorage.getItem("ARRAY"))

const render = (renderTarget, item) => {
  if (item.stat === "doneOption") {
    style = "doneCheck";
  }
  return (
    renderTarget +
    `<div class="containerOfTodo" draggable="true" id=${item.id}>
   <div class="checkcontainer">
   <h1 class="checksvg ${style}" onclick="setToDone(${item.id})"> ✓ </h1>
   <div class="infobox">
     <h2>${item.title}</h2>
     <h5>${item.description}</h5>
     <p class="prioritybox">${item.priority}</p>
   </div>
   </div>
   <div class="buttons">
     <img src="delete.svg" alt="" onclick="deleteTask(${item.id})" />
     <img src="edit.svg" alt="" onclick="editTask(${item.id})" id="editButton_${item.id}"/>
   </div>
 </div>`
  );
};

const addToRender = () => {
  let todorender = "";
  let inprogressrender = "";
  let stuckrender = "";
  let donerender = "";

  todoArray.forEach((item) => {
    if (item.stat == "todoOption") {
      todorender = render(todorender, item);
    } else if (item.stat == "inprogressOption") {
      inprogressrender = render(inprogressrender, item);
    } else if (item.stat == "stuckOption") {
      stuckrender = render(stuckrender, item);
    } else {
      donerender = render(donerender, item);
      style = "";
    }
  });

  todoDiv.innerHTML = todorender;
  inProgressDiv.innerHTML = inprogressrender;
  stuckDiv.innerHTML = stuckrender;
  doneDiv.innerHTML = donerender;
};
addToRender();

let count = 1;
count = parseInt(localStorage.getItem("COUNT"))

//Form submit
addTaskButton.addEventListener("click", (e) => {
  e.preventDefault();

  if (title.value !== "" && description.value !== "") {
    if (editingTaskId !== null) {
      const editedTaskIndex = todoArray.findIndex(
        (task) => task.id === editingTaskId
      );
      todoArray[editedTaskIndex] = {
        title: title.value,
        description: description.value,
        priority: priorityOption.value,
        stat: statusOption.value,
        id: editingTaskId,
      };

      editingTaskId = null;
    } else {
      todoArray.push({
        title: title.value,
        description: description.value,
        priority: priorityOption.value,
        stat: statusOption.value,
        id: count,
      });
      count++;
      localStorage.setItem("COUNT", count);
    }
    localStorage.setItem("ARRAY", JSON.stringify(todoArray));
    console.log(todoArray);
    AddTask.classList.remove("show");
    title.value = "";
    description.value = "";
    addToRender();
  }
});

// DELETE TASK

function deleteTask(taskId) {
  todoArray = todoArray.filter((task) => task.id !== taskId);
  localStorage.setItem("ARRAY", JSON.stringify(todoArray));
  
  addToRender();
}

// EDIT TASK

function editTask(taskId) {
  const taskToEdit = todoArray.find((task) => task.id === taskId);

  title.value = taskToEdit.title;
  description.value = taskToEdit.description;
  priorityOption.value = taskToEdit.priority;
  statusOption.value = taskToEdit.stat;

  editingTaskId = taskId;

  AddTask.classList.add("show");
}

// SET TO DONE

const setToDone = (id) => {
  const editedTaskIndex = todoArray.findIndex((task) => task.id === id);
  todoArray[editedTaskIndex] = {
    ...todoArray[editedTaskIndex],
    stat: "doneOption",
  };
  localStorage.setItem("ARRAY", JSON.stringify(todoArray));
  addToRender();

};

// DRAG AND DROP

const containerOfTodo = document.querySelectorAll(".containerOfTodo");
containerOfTodo.forEach((task) => {
  task.addEventListener("dragstart", (e) => {
    console.log("Drag Start - taskId:", task.id);
    e.dataTransfer.setData("text/plain", task.id);
  });
});

const subcontainers = document.querySelectorAll(".subcontainer");
subcontainers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault(); // This is necessary to allow a drop
  });

  container.addEventListener("drop", (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    console.log('taskId:', taskId); // log taskId
    const task = todoArray.find((task) => task.id === parseInt(taskId));
    console.log('task:', task); // log task
    if (task) { // check if task is not undefined
      if (container.id === "todoChanger") {
        task.stat = "todoOption";
      } else if (container.id === "inProgressChanger") {
        task.stat = "inprogressOption";
      } else if (container.id === "stuckChanger") {
        task.stat = "stuckOption";
      } else if (container.id === "doneChanger") {
        task.stat = "doneOption";
      }
      localStorage.setItem("ARRAY", JSON.stringify(todoArray));
      addToRender();
    } else {
      console.log('No task found with id:', taskId); // log if no task found
    }
  });
});
