// লিস্টে নতুন তথ্য যোগ করুন
todoList = document.getElementById('todo-list');
addTodoBtn = document.getElementById('add-todo-btn');
clearTodoBtn = document.getElementById('clear-todo-btn');

addTodoBtn.addEventListener('click', function() {
  const todoInput = prompt('কিছু লিখুন');
  if (todoInput !== null) {
    const todoItem = document.createElement('LI');
    todoItem.textContent = todoInput;
    todoList.appendChild(todoItem);
  }
});

clearTodoBtn.addEventListener('click', function() {
  todoList.innerHTML = '';
})