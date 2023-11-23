document.addEventListener('DOMContentLoaded', loadTasks);

function addTask(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('taskInput');
        const taskText = input.value.trim();

        if (taskText !== '') {
            const taskList = document.getElementById('taskList');
            const taskItem = document.createElement('li');
            const checkboxWrapper = document.createElement('span');
            const checkbox = document.createElement('input');
            const deleteBtn = document.createElement('span');

            const date = new Date();
            const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', completeTask);

            deleteBtn.innerHTML = ' &#10006;';
            deleteBtn.className = 'deleteBtn';
            deleteBtn.addEventListener('click', deleteTask);

            checkboxWrapper.className = 'checkboxWrapper';
            checkboxWrapper.appendChild(checkbox);

            const timeSpan = document.createElement('span');
            timeSpan.classList.add('yellow-time');
            timeSpan.textContent = formattedDate.slice(formattedDate.indexOf(',') + 2); 

            const taskTextSpan = document.createElement('span');

            taskTextSpan.classList.add('list-info');
            taskTextSpan.innerHTML = `${taskText}`;
            taskTextSpan.appendChild(timeSpan);

            taskItem.className = 'taskItem';
            taskItem.appendChild(checkboxWrapper);
            taskItem.appendChild(taskTextSpan);
            taskItem.appendChild(deleteBtn);

            taskList.appendChild(taskItem);
            input.value = '';

            saveTasks();
        }
    }
}

function completeTask() {
    const taskItem = this.parentNode.parentNode;
    const listInfoSpan = taskItem.querySelector('.list-info');
    
    listInfoSpan.classList.toggle('completedTask');

    if (this.checked) {
        this.style.display = 'none';
    }

    saveTasks();
}

function deleteTask() {
    const taskItem = this.parentNode;
    taskItem.parentNode.removeChild(taskItem);
    saveTasks();
}

function saveTasks() {
    const taskList = document.getElementById('taskList').innerHTML;
    localStorage.setItem('tasks', taskList);
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    const savedTasks = localStorage.getItem('tasks');

    if (savedTasks) {
        taskList.innerHTML = savedTasks;

        const checkboxes = document.querySelectorAll('#taskList .taskItem input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.addEventListener('change', completeTask));

        const deleteButtons = document.querySelectorAll('#taskList .taskItem .deleteBtn');
        deleteButtons.forEach(button => button.addEventListener('click', deleteTask));
    }
}


function showAll() {
    const taskItems = document.querySelectorAll('#taskList .taskItem');
    taskItems.forEach(taskItem => {
        taskItem.style.display = 'flex';
    });
}

function showCompleted() {
    const taskItems = document.querySelectorAll('#taskList .taskItem');
    taskItems.forEach(taskItem => {
        const completed = taskItem.querySelector('.list-info').classList.contains('completedTask');
        if (!completed) {
            taskItem.style.display = 'none';
        } else {
            taskItem.style.display = 'flex';
        }
    });
}

function showUncompleted() {
    const taskItems = document.querySelectorAll('#taskList .taskItem');
    taskItems.forEach(taskItem => {
        const completed = taskItem.querySelector('.list-info').classList.contains('completedTask');
        if (completed) {
            taskItem.style.display = 'none';
        } else {
            taskItem.style.display = 'flex';
        }
    });
}
