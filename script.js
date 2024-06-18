document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const startTime = document.getElementById('start-time');
    const endTime = document.getElementById('end-time');
    const taskCategory = document.getElementById('task-category');
    const taskPriority = document.getElementById('task-priority');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskClick);

    function addTask() {
        const taskText = taskInput.value.trim();
        const startTimeValue = startTime.value;
        const endTimeValue = endTime.value;
        const taskCategoryValue = taskCategory.value;
        const taskPriorityValue = taskPriority.value;

        if (taskText !== '' && startTimeValue !== '' && endTimeValue !== '') {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <div class="task-info">
                    <span class="task-text">${taskText}</span>
                    <span class="start-time">${startTimeValue}</span>
                    <span class="end-time">${endTimeValue}</span>
                    <span class="task-category">${taskCategoryValue}</span>
                    <span class="task-priority">${taskPriorityValue}</span>
                </div>
                <button class="edit-btn">&#9998;</button>
                <button class="delete-btn">&times;</button>
            `;
            taskList.appendChild(taskItem);
            saveTask(taskText, startTimeValue, endTimeValue, taskCategoryValue, taskPriorityValue);
            taskInput.value = '';
            startTime.value = '';
            endTime.value = '';
        }
    }

    function handleTaskClick(event) {
        const item = event.target;
        const taskItem = item.parentElement;

        if (item.classList.contains('delete-btn')) {
            taskItem.remove();
            deleteTask(taskItem);
        } else if (item.classList.contains('edit-btn')) {
            editTask(taskItem);
        } else {
            taskItem.classList.toggle('completed');
            updateTaskCompletion(taskItem);
        }
    }

    function saveTask(text, start, end, category, priority) {
        const tasks = getTasks();
        tasks.push({ text, start, end, category, priority, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
    }

    function addTaskToDOM(task) {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <div class="task-info">
                <span class="task-text">${task.text}</span>
                <span class="start-time">${task.start}</span>
                <span class="end-time">${task.end}</span>
                <span class="task-category">${task.category}</span>
                <span class="task-priority">${task.priority}</span>
            </div>
            <button class="edit-btn">&#9998;</button>
            <button class="delete-btn">&times;</button>
        `;
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        taskList.appendChild(taskItem);
    }

    function deleteTask(taskItem) {
        let tasks = getTasks();
        const taskText = taskItem.querySelector('.task-text').innerText;
        tasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function editTask(taskItem) {
        const taskTextElement = taskItem.querySelector('.task-text');
        const startTimeElement = taskItem.querySelector('.start-time');
        const endTimeElement = taskItem.querySelector('.end-time');
        const categoryElement = taskItem.querySelector('.task-category');
        const priorityElement = taskItem.querySelector('.task-priority');

        const newText = prompt('Edit task name:', taskTextElement.innerText);
        const newStartTime = prompt('Edit start time:', startTimeElement.innerText);
        const newEndTime = prompt('Edit end time:', endTimeElement.innerText);
        const newCategory = prompt('Edit category:', categoryElement.innerText);
        const newPriority = prompt('Edit priority:', priorityElement.innerText);

        if (newText !== null && newStartTime !== null && newEndTime !== null && newCategory !== null && newPriority !== null) {
            taskTextElement.innerText = newText;
            startTimeElement.innerText = newStartTime;
            endTimeElement.innerText = newEndTime;
            categoryElement.innerText = newCategory;
            priorityElement.innerText = newPriority;

            updateTask(taskItem, newText, newStartTime, newEndTime, newCategory, newPriority);
        }
    }

    function updateTask(taskItem, newText, newStartTime, newEndTime, newCategory, newPriority) {
        const tasks = getTasks();
        const taskText = taskItem.querySelector('.task-text').innerText;

        const taskIndex = tasks.findIndex(task => task.text === taskText);
        tasks[taskIndex].text = newText;
        tasks[taskIndex].start = newStartTime;
        tasks[taskIndex].end = newEndTime;
        tasks[taskIndex].category = newCategory;
        tasks[taskIndex].priority = newPriority;

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskCompletion(taskItem) {
        const tasks = getTasks();
        const taskText = taskItem.querySelector('.task-text').innerText;
        const taskIndex = tasks.findIndex(task => task.text === taskText);
        tasks[taskIndex].completed = taskItem.classList.contains('completed');
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
