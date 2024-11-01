const inputTitle = document.querySelector(".inputTitre");
const taskDate = document.querySelector(".inputDate");
const inputDescription = document.querySelector(".inputDescription");
const inputEtat = document.querySelector(".inputEtat");
const tasksDiv = document.querySelector(".tasks");
const notfound = document.querySelector(".notfound");
const add = document.querySelector(".add");

let arrayTask = JSON.parse(localStorage.getItem("task")) || []; // if the local storage is empty == an empty array

// Display tasks on the DOM
if (arrayTask.length > 0) {
    arrayTask.forEach(addElementToTheDom);
} else {
    notfoundFunction();
}

 
function notfoundFunction() {
    notfound.innerHTML = arrayTask.length === 0 
        ? '<p style="font-size: 3rem;text-align: center; margin-top: 5rem; color: black;" class="text-gray-900 text-7xl dark:text-white">No task found</p>'
        : "";
}

 
add.onclick = function () {
    if (inputTitle.value && taskDate.value && inputDescription.value && inputEtat.value) {
        addTaskToArray(inputTitle.value, taskDate.value, inputDescription.value, inputEtat.value);
        resetForm();
    }
}

 
function addTaskToArray(taskTitle, taskDate, inputDescription, inputEtat) {
    const task = {
        id: Date.now(),
        title: taskTitle,
        date: taskDate,
        description: inputDescription,
        etat: inputEtat,
    };
    
    arrayTask.push(task);
    addToLocalStorage();
    addElementToTheDom(task);
    notfoundFunction();
}

// Add a task element to the DOM
function addElementToTheDom(task) {
    let choix = "";
    if (task.etat == "completed") {
        choix = "line-through"
    }else if(task.etat == "To Do"){
        choix= ""
    }else if(task.etat == "in progress"){
          choix= ""
    }
    let tr = document.createElement("tr");
    tr.className = ` odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700`;
    tr.setAttribute("data-id", task.id);


    tr.innerHTML = `
        <td class="${choix} px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${task.title}</td>
        <td class="${choix} px-6 py-4">${task.date}</td>
        <td class="${choix} px-6 py-4">${task.description}</td>
        <td class="${choix} px-6 py-4">${task.etat}</td>
        <td class="font-medium text-blue-600 dark:text-blue-500 hover:underline px-6 py-4 edit cursor-pointer">edit</td>
        <td class="delete cursor-pointer font-medium text-red-600 dark:text-blue-500 hover:underline px-6 py-4">delete</td>
    `;
    tasksDiv.appendChild(tr);
}



// Delete functionality
tasksDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        const taskRow = e.target.parentElement;
        const taskId = taskRow.getAttribute("data-id");

        // Remove task from array and DOM
        arrayTask = arrayTask.filter(task => task.id !== parseInt(taskId));
        taskRow.remove();
        addToLocalStorage();
        notfoundFunction();
    }
});

// Edit functionality
tasksDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit")) {
        const taskRow = e.target.parentElement;
        const taskId = taskRow.getAttribute("data-id");
        const task = arrayTask.find(task => task.id === parseInt(taskId));

         taskRow.innerHTML = `
            <td><input type="text" value="${task.title}" class="edit-title px-4 py-2"></td>
            <td><input type="date" value="${task.date}" class="edit-date px-4 py-2"></td>
            <td><input type="text" value="${task.description}" class="edit-description px-4 py-2"></td>
                <select edit-etat aria-required="true" required id="status" required  class="edit-etat inputEtat input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  name="" id="">
                    <option value="" disabled selected>Status</option>
                    <option value="To Do">To Do </option>
                    <option value="in progress" > in progress</option>
                    <option value="completed" >completed</option>
                </select>
            <td class="save cursor-pointer text-green-600 px-4 py-2">Save</td>
            <td class="cancel cursor-pointer text-gray-600 px-4 py-2">Cancel</td>
        `;

         taskRow.querySelector(".save").onclick = () => {
            task.title = taskRow.querySelector(".edit-title").value;
            task.date = taskRow.querySelector(".edit-date").value;
            task.description = taskRow.querySelector(".edit-description").value;
            task.etat = taskRow.querySelector(".edit-etat").value;

            renderTasks();
            addToLocalStorage()
        };
        taskRow.querySelector(".cancel").onclick = () => {
            renderTasks();
        };
    }
});

// Render tasks in DOM
function renderTasks() {
    tasksDiv.innerHTML = "";

    for (let i = 0; i < arrayTask.length; i++) {
        addElementToTheDom(arrayTask[i])
    }
}

// Update local storage
function addToLocalStorage() {
    localStorage.setItem("task", JSON.stringify(arrayTask));
}


function resetForm() {
    inputTitle.value = "";
    taskDate.value = "";
    inputDescription.value = "";
    inputEtat.value = "";
}








