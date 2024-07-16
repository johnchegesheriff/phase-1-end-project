document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const renderTodos = () => {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const todoItem = document.createElement('li');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;

            const todoText = document.createElement('span');
            todoText.textContent = todo.text;
            todoText.addEventListener('click', () => {
                todos[index].completed = !todos[index].completed;
                saveTodos();
                renderTodos();
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
            });

            todoItem.appendChild(todoText);
            todoItem.appendChild(deleteButton);
            todoList.appendChild(todoItem);
        });
    };

    todoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newTodoText = todoInput.value.trim();
        if (newTodoText !== '') {
            todos.push({ text: newTodoText, completed: false });
            todoInput.value = '';
            saveTodos();
            renderTodos();
        }
    });

    renderTodos();
});
