document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://669bbae3276e45187d364d63.mockapi.io/api/todo/todo-app';
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoDate = document.getElementById('todo-date');
    const todoCategory = document.getElementById('todo-category');
    const todoList = document.getElementById('todo-list');

    // Fetch existing tasks from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => addTaskToList(task));
        });

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskText = todoInput.value.trim();
        const taskDate = todoDate.value;
        const taskCategory = todoCategory.value.trim();

        if (taskText) {
            const newTask = {
                text: taskText,
                date: taskDate,
                category: taskCategory
            };

            // Add new task to the API
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            })
            .then(response => response.json())
            .then(task => {
                addTaskToList(task);
                todoForm.reset();
            });
        }
    });

    function addTaskToList(task) {
        const li = document.createElement('li');
        const taskDetails = document.createElement('div');

        taskDetails.innerHTML = `<span>${task.text}</span> ${task.date ? `<span>Due: ${task.date}</span>` : ''} ${task.category ? `<span>Category: ${task.category}</span>` : ''}`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit');
        editButton.addEventListener('click', () => editTask(task, li));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => deleteTask(task.id, li));

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.classList.add('complete');
        completeButton.addEventListener('click', () => li.classList.toggle('completed'));

        li.appendChild(taskDetails);
        li.appendChild(editButton);
        li.appendChild(completeButton);
        li.appendChild(deleteButton);

        todoList.appendChild(li);
    }

    function editTask(task, li) {
        const editForm = document.createElement('form');
        editForm.classList.add('edit-form');

        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = task.text;

        const editDate = document.createElement('input');
        editDate.type = 'date';
        editDate.value = task.date;

        const editCategory = document.createElement('input');
        editCategory.type = 'text';
        editCategory.value = task.category;

        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.textContent = 'Save';
        
        editForm.appendChild(editInput);
        editForm.appendChild(editDate);
        editForm.appendChild(editCategory);
        editForm.appendChild(saveButton);

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const updatedTask = {
                text: editInput.value.trim(),
                date: editDate.value,
                category: editCategory.value.trim()
            };

            // Update task in the API
            fetch(`${apiUrl}/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTask)
            })
            .then(response => response.json())
            .then(updatedTask => {
                li.innerHTML = '';
                addTaskToList(updatedTask);
            });
        });

        li.innerHTML = '';
        li.appendChild(editForm);
    }

    function deleteTask(taskId, li) {
        // Delete task from the API
        fetch(`${apiUrl}/${taskId}`, {
            method: 'DELETE'
        })
        .then(() => {
            li.remove();
        });
    }
});
