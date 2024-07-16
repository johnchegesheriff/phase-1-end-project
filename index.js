document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoDate = document.getElementById('todo-date');
    const todoCategory = document.getElementById('todo-category');
    const todoList = document.getElementById('todo-list');

    const fetchTodos = async () => {
        const response = await fetch('http://localhost:3000/todos');
        const todos = await response.json();
        renderTodos(todos);
    };

    const addTodo = async (todo) => {
        await fetch('http://localhost:3000/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo),
        });
        fetchTodos();
    };

    const updateTodo = async (todo) => {
        await fetch(`http://localhost:3000/todos/${todo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo),
        });
        fetchTodos();
    };

    const deleteTodo = async (id) => {
        await fetch(`http://localhost:3000/todos/${id}`, {
            method: 'DELETE',
        });
        fetchTodos();
    };

    const renderTodos = (todos) => {
        todoList.innerHTML = '';
        todos.forEach((todo) => {
            const todoItem = document.createElement('li');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;

            const todoText = document.createElement('span');
            todoText.textContent = `${todo.text} - ${todo.dueDate ? todo.dueDate : 'No due date'} - ${todo.category ? todo.category : 'No category'}`;
            todoText.addEventListener('click', () => {
                todo.completed = !todo.completed;
                updateTodo(todo);
            });

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                const editForm = document.createElement('form');
                editForm.className = 'edit-form';

                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = todo.text;
                const editDate = document.createElement('input');
                editDate.type = 'date';
                editDate.value = todo.dueDate || '';
                const editCategory = document.createElement('input');
                editCategory.type = 'text';
                editCategory.value = todo.category || '';

                const saveButton = document.createElement('button');
                saveButton.type = 'submit';
                saveButton.textContent = 'Save';

                editForm.appendChild(editInput);
                editForm.appendChild(editDate);
                editForm.appendChild(editCategory);
                editForm.appendChild(saveButton);

                editForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    todo.text = editInput.value;
                    todo.dueDate = editDate.value;
                    todo.category = editCategory.value;
                    updateTodo(todo);
                });

                todoItem.innerHTML = '';
                todoItem.appendChild(editForm);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                deleteTodo(todo.id);
            });

            todoItem.appendChild(todoText);
            todoItem.appendChild(editButton);
            todoItem.appendChild(deleteButton);
            todoList.appendChild(todoItem);
        });
    };

    todoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newTodoText = todoInput.value.trim();
        const newTodoDate = todoDate.value;
        const newTodoCategory = todoCategory.value.trim();
        if (newTodoText !== '') {
            const newTodo = {
                text: newTodoText,
                dueDate: newTodoDate || null,
                category: newTodoCategory || null,
                completed: false,
            };
            addTodo(newTodo);
            todoInput.value = '';
            todoDate.value = '';
            todoCategory.value = '';
        }
    });

    fetchTodos();
});
