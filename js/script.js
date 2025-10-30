//create a class object named task with the properties id, desccription, dueDate, and isCompleted
class Task {
    constructor(id, description, dueDate, isCompleted) {
        this.id = id;
        this.description = description;
        this.dueDate = dueDate;
        this.isCompleted = isCompleted;
    }
}

// //export the class object
// export default Task;

let allTaskArr = [];

//function to add a task to the allTaskArr
function addTask(task) {
    allTaskArr.push(task);
}

//function to remove a task from the allTaskArr by id
function removeTask(id) {
    allTaskArr = allTaskArr.filter(task => task.id !== id);
}

//function to get all tasks
function getAllTasks() {
    return allTaskArr;
}

//function to get a task by id
function getTaskById(id) {
    // let taskArrayByID = structuredClone(allTaskArr);
    // return taskArrayByID.find(task => task.id === id);
    return allTaskArr.find(task => task.id === id);
}

//function to mark a task as completed by id
function markTaskAsCompleted(id) {
    const task = getTaskById(id);
    if (task) {
        task.isCompleted = true;
    }
}

//function to get the tasks of the current day
function getTodayTasks() {
    const currentDate = new Date().toISOString().split('T')[0];
    let todayTasksArray = structuredClone(allTaskArr);
    return todayTasksArray.filter(task => task.dueDate === currentDate);
};

//function to get the tasks of the current week
function getWeekTasks() {
    const currentDate = new Date();
    const currentDateMidnight = new Date(Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate()
    ));
    const currentWeekDay = currentDateMidnight.getDay(); //0-6 (0 is Sunday, 6 is Saturday)
    const weekStartDate = new Date(currentDateMidnight);
    weekStartDate.setDate(currentDateMidnight.getDate() - currentWeekDay); //set to Sunday
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6); //set to Saturday

    let weekTasksArray = structuredClone(allTaskArr);

    //order the weekTaskArray by dueDate and id
    weekTasksArray.sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        //if dueDates are equal, sort by id
        return a.id - b.id;
    });

    return weekTasksArray.filter(task => {
        const taskDueDate = new Date(task.dueDate);
        return taskDueDate >= weekStartDate && taskDueDate <= weekEndDate;
    });

};

//function to get the tasks of the current month
function getMonthTasks() {
    const currentDate = new Date();
    const currentDateMidnight = new Date(Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate()
    ));
    const currentMonth = currentDateMidnight.getMonth(); //0-11
    const currentYear = currentDateMidnight.getFullYear();

    let monthTaskArray = structuredClone(allTaskArr);

    //order the monthTaskArray by dueDate and id
    monthTaskArray.sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        //if dueDates are equal, sort by id
        return a.id - b.id;
    });

    return monthTaskArray.filter(task => {
        const taskDueDate = new Date(task.dueDate);
        return taskDueDate.getMonth() === currentMonth && taskDueDate.getFullYear() === currentYear;
    });
};

//function to get all completed tasks
function getCompletedTasks() {
    let completedTasksArray = structuredClone(allTaskArr);
    return completedTasksArray.filter(task => task.isCompleted);
}

//function to get all pending tasks
function getPendingTasks() {
    let pendingTasksArray = structuredClone(allTaskArr);
    return pendingTasksArray.filter(task => !task.isCompleted);
}

//function to get all tasks where dueDate is before the current date
function getOverdueTasks() {
    const currentDate = new Date();
    //currentDate.setHours(0, 0, 0, 0); 
    //set time to 00:00:00 to compare only dates
    const currentDateMidnight = new Date(Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate()
    ));
console.log(allTaskArr)
    let overdueTasksArray = structuredClone(allTaskArr);
    return overdueTasksArray.filter(task => new Date(task.dueDate) < currentDateMidnight && !task.isCompleted);
}

//get overdue tasks and display the total number in the sidebar
function displayOverdueTasksCount() {
    let overdueTasks = getOverdueTasks();
    let spnOverDueTotal = document.getElementById('spnOverDueTotal');
    let totalOverdueTasks = overdueTasks.length;
    
    if (totalOverdueTasks > 0) {
        spnOverDueTotal.innerText = overdueTasks.length;
    }
    else{
        spnOverDueTotal.innerText = '';
    };
}

//funtion to get the last task id
function getLastTaskId() {
    if (allTaskArr.length === 0) {
        return 0;
    }
    return allTaskArr[allTaskArr.length - 1].id;
}


//function to clear all tasks
function clearAllTasks() {
    allTaskArr = [];
}

//save tasks to session storage
function saveTasksToSessionStorage() {
    sessionStorage.setItem('tasks', JSON.stringify(allTaskArr));
}

//load tasks from session storage
function loadTasksFromSessionStorage() {
    const tasks = JSON.parse(sessionStorage.getItem('tasks'));
    if (tasks) {
        allTaskArr = tasks.map(task => new Task(task.id, task.description, task.dueDate, task.isCompleted));
    }
}

//load tasks from session storage on page load
window.onload = function () {
    loadTasksFromSessionStorage();
    renderTaskTable();
    displayOverdueTasksCount();
};

//set focus on task description input when the modal is opened
let btnOpenAddTask = document.getElementById('btnOpenAddTask');
btnOpenAddTask.addEventListener('click', function () {
    let inpTaskDescription = document.getElementById('inpTaskDescr');
    inpTaskDescription.focus();
});

//add new task when the add button is clicked
let btnAddTask = document.getElementById('btnAddTask');
btnAddTask.addEventListener('click', function () {

    let lastId = getLastTaskId();
    let taskId = lastId + 1;
    let taskDescription = document.getElementById('inpTaskDescr').value;
    let taskDueDate = document.getElementById('inpTaskDueDate').value;

    //check if task values are valid
    let taskValuesAreValid = checkTaskValuesValidity();

    if (!taskValuesAreValid) { return; }

    let newTask = new Task(taskId, taskDescription, taskDueDate, false);
    addTask(newTask);
    saveTasksToSessionStorage();
    renderTaskTable();

    //close the modal
    let addTaskModal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
    addTaskModal.hide();

});

//check if task description and task due date are valid
function checkTaskValuesValidity() {

    let inpTaskDescription = document.getElementById('inpTaskDescr');
    let taskDescription = inpTaskDescription.value;
    let inpTaskDueDate = document.getElementById('inpTaskDueDate');
    let taskDueDate = inpTaskDueDate.value;

    let taskDescrError = document.getElementById('divTaskDescrError');
    if (taskDescription === '') {
        //show error message
        taskDescrError.classList.add('d-block');
        taskDescrError.classList.remove('d-none');
        inpTaskDescription.classList.add('is-invalid');
        return false;
    }

    if (taskDescrError.classList.contains('d-block')) {
        //remove error message
        taskDescrError.classList.add('d-none');
        taskDescrError.classList.remove('d-block');
        inpTaskDescription.classList.remove('is-invalid');
    }

    let dueDateError = document.getElementById('divDueDateError');
    if (taskDueDate === '') {
        //show error message
        dueDateError.classList.add('d-block');
        dueDateError.classList.remove('d-none');
        inpTaskDueDate.classList.add('is-invalid');
        return false;
    }

    if (dueDateError.classList.contains('d-block')) {
        //remove error message
        dueDateError.classList.add('d-none');
        dueDateError.classList.remove('d-block');
        inpTaskDueDate.classList.remove('is-invalid');
    }

    return true
}

//add tasks to the taskTable
function renderTaskTable() {
    let taskTableBody = document.getElementById('taskTableBody');
    taskTableBody.innerHTML = '';

    //get active link
    let activeLinkId = document.querySelector('.custom-link-active').id;

    //check which interval the user selected
    let selectedTaskArr = [];
    switch (activeLinkId) {
        case 'aDay':
            selectedTaskArr = getTodayTasks();
            break;

        case 'aWeek':
            selectedTaskArr = getWeekTasks();
            break;

        case 'aMonth':
            selectedTaskArr = getMonthTasks();
            break;

        case 'aOverdue':
            selectedTaskArr = getOverdueTasks();
            break;

        default:
            selectedTaskArr = getTodayTasks();
            break;
    }

    //add tasks to the tbody element
    selectedTaskArr.forEach(task => {
        let row = taskTableBody.insertRow();
        let cellId = row.insertCell(0);
        let cellDescription = row.insertCell(1);
        let cellDueDate = row.insertCell(2);

        cellId.innerText = task.id;
        cellDescription.innerText = task.description;
        cellDueDate.innerText = task.dueDate;

        //if task is completed, add a class to the row
        if (task.isCompleted) {
            row.classList.add('table-success');
        }

        if (activeLinkId === 'aOverdue') {
            row.classList.add('table-danger');
        }

        //if taskdueDate is before current date and task is not completed, add a class to the row
        const currentDate = new Date();
        const currentDateMidnight = new Date(Date.UTC(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth(),
            currentDate.getUTCDate()
        ));
        const taskDueDate = new Date(task.dueDate);
        if (taskDueDate < currentDateMidnight && !task.isCompleted) {
            row.classList.add('table-danger');
        }

    });

    addButtonsToTaskTable();
    displayOverdueTasksCount();

}

//clear new task input fields and error messages after modal is closed
let modalAddTask = document.getElementById('addTaskModal');
modalAddTask.addEventListener('hidden.bs.modal', function () {
    document.getElementById('inpTaskDescr').value = '';
    document.getElementById('inpTaskDueDate').value = '';

    let inpTaskDescription = document.getElementById('inpTaskDescr');

    let taskDescrError = document.getElementById('divTaskDescrError');
    if (!taskDescrError.classList.contains('d-none')) {
        taskDescrError.classList.add('d-none');
    }

    if (taskDescrError.classList.contains('d-block')) {
        taskDescrError.classList.remove('d-block');
    }

    if (inpTaskDescription.classList.contains('is-invalid')) {
        inpTaskDescription.classList.remove('is-invalid');
    }

    let inpTaskDueDate = document.getElementById('inpTaskDueDate');
    let dueDateError = document.getElementById('divDueDateError');

    if (!dueDateError.classList.contains('d-none')) {
        dueDateError.classList.add('d-none');
    }

    if (dueDateError.classList.contains('d-block')) {
        dueDateError.classList.remove('d-block');
    }

    if (inpTaskDueDate.classList.contains('is-invalid')) {
        inpTaskDueDate.classList.remove('is-invalid');
    }
});

//clear new task id span after modal is closed
let modaDelTask = document.getElementById('delTaskModal');
modaDelTask.addEventListener('hidden.bs.modal', function () {
    document.getElementById('spDelTaskInfo').InnerTExt = '';
});

//build the html for the completed button and the delete button in the task table
//and add event listeners to them
function addButtonsToTaskTable() {
    let taskTableBody = document.getElementById('taskTableBody');
    Array.from(taskTableBody.rows).forEach(row => {
        let cellActions = row.insertCell(3);

        let divActions = document.createElement('div');
        divActions.className = 'd-flex flex-column flex-md-row align-items-end justify-content-between';
        cellActions.appendChild(divActions);

        let taskId = parseInt(row.cells[0].innerText);
        let task = getTaskById(taskId);

        if (!task.isCompleted) {
            let btnComplete = document.createElement('button');
            btnComplete.className = 'btn btn-sm btn-success text-light col-10 col-sm-6 col-md-4 col-lg-5 my-1';
            btnComplete.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16"
                height="16" fill="currentColor"
                class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
            </svg>
        `;

            //add data-id attributte with the task id to the complete button
            btnComplete.setAttribute('data-id', taskId);

            btnComplete.addEventListener('click', function () {

                markTaskAsCompleted(taskId);
                saveTasksToSessionStorage();
                renderTaskTable();
            });

            // cellActions.appendChild(btnComplete);
            divActions.appendChild(btnComplete);
        }

        let btnDelete = document.createElement('button');
        // btnDelete.className = 'btn btn-sm btn-danger text-light col-10 col-sm-6 col-md-4 col-lg-5';
        btnDelete.className = 'btn btn-sm btn-danger text-light col-10 col-sm-6 col-md-4 col-lg-5 my-1';

        if (task.isCompleted) {
            btnDelete.classList.add('ms-auto');
        }

        btnDelete.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16"
                height="16" fill="currentColor"
                class="bi bi-trash3-fill" viewBox="0 0 16 16">
                <path
                    d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
            </svg>
        `;

        //add data-bs-toggle and data-bs-target attributes to the delete button to open the delete confirmation modal
        btnDelete.setAttribute('data-bs-toggle', 'modal');
        btnDelete.setAttribute('data-bs-target', '#delTaskModal');
        //add data-id attributte with the task id to the complete button
        btnDelete.setAttribute('data-id', row.cells[0].innerText);

        // cellActions.appendChild(btnDelete);
        divActions.appendChild(btnDelete);

    });
}

//add the task id to the spDelTaskInfo span in the delete confirmation modal
let delTaskModal = document.getElementById('delTaskModal');
delTaskModal.addEventListener('show.bs.modal', function (event) {
    let button = event.relatedTarget;
    let taskId = button.getAttribute('data-id');
    let spDelTaskInfo = document.getElementById('spDelTaskInfo');
    spDelTaskInfo.innerText = taskId;
});

//delete the task when the confirm delete button is clicked
let btnConfirmDelete = document.getElementById('btnDelTaskConfirm');
btnConfirmDelete.addEventListener('click', function () {
    let spDelTaskInfo = document.getElementById('spDelTaskInfo');
    let taskId = parseInt(spDelTaskInfo.innerText);
    removeTask(taskId);
    saveTasksToSessionStorage();
    renderTaskTable();

    //close the modal
    let delTaskModal = bootstrap.Modal.getInstance(document.getElementById('delTaskModal'));
    delTaskModal.hide();
});