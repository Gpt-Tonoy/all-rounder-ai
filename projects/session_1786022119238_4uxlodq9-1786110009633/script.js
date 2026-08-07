document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  const todoList = document.querySelector('#todo-list');

  const list = JSON.parse(localStorage.getItem('list')) || [];

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.querySelector('#title').value;
    const description = document.querySelector('#description').value;
    const priority = document.querySelector('#priority').value;
    const date = document.querySelector('#date').value;

    const newTodo = {
      title,
      description,
      priority,
      date,
      done: false
    };

    list.push(newTodo);
    localStorage.setItem('list', JSON.stringify(list));
    todoList.innerHTML = '';
    for (let i = 0; i < list.length; i++) {
      const todoItem = document.createElement('li');
      todoItem.textContent = `${list[i].title} - ${list[i].priority} - ${list[i].date}`;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function() {
        list.splice(i, 1);
        localStorage.setItem('list', JSON.stringify(list));
        todoList.innerHTML = '';
        for (let j = 0; j < list.length; j++) {
          const todoItem = document.createElement('li');
          todoItem.textContent = `${list[j].title} - ${list[j].priority} - ${list[j].date}`;
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', function() {
            list.splice(j, 1);
            localStorage.setItem('list', JSON.stringify(list));
            todoList.innerHTML = '';
            for (let k = 0; k < list.length; k++) {
              const todoItem = document.createElement('li');
              todoItem.textContent = `${list[k].title} - ${list[k].priority} - ${list[k].date}`;
              const deleteButton = document.createElement('button');
              deleteButton.textContent = 'Delete';
              deleteButton.addEventListener('click', function() {
                list.splice(k, 1);
                localStorage.setItem('list', JSON.stringify(list));
                todoList.innerHTML = '';
                for (let l = 0; l < list.length; l++) {
                  const todoItem = document.createElement('li');
                  todoItem.textContent = `${list[l].title} - ${list[l].priority} - ${list[l].date}`;
                  const deleteButton = document.createElement('button');
                  deleteButton.textContent = 'Delete';
                  deleteButton.addEventListener('click', function() {
                    list.splice(l, 1);
                    localStorage.setItem('list', JSON.stringify(list));
                    todoList.innerHTML = '';
                    for (let m = 0; m < list.length; m++) {
                      const todoItem = document.createElement('li');
                      todoItem.textContent = `${list[m].title} - ${list[m].priority} - ${list[m].date}`;
                      const deleteButton = document.createElement('button');
                      deleteButton.textContent = 'Delete';
                      deleteButton.addEventListener('click', function() {
                        list.splice(m, 1);
                        localStorage.setItem('list', JSON.stringify(list));
                        todoList.innerHTML = '';
                        for (let n = 0; n < list.length; n++) {
                          const todoItem = document.createElement('li');
                          todoItem.textContent = `${list[n].title} - ${list[n].priority} - ${list[n].date}`;
                          const deleteButton = document.createElement('button');
                          deleteButton.textContent = 'Delete';
                          deleteButton.addEventListener('click', function() {
                            list.splice(n, 1);
                            localStorage.setItem('list', JSON.stringify(list));
                            todoList.innerHTML = '';
                            for (let o = 0; o < list.length; o++) {
                              const todoItem = document.createElement('li');
                              todoItem.textContent = `${list[o].title} - ${list[o].priority} - ${list[o].date}`;
                              const deleteButton = document.createElement('button');
                              deleteButton.textContent = 'Delete';
                              deleteButton.addEventListener('click', function() {
                                list.splice(o, 1);
                                localStorage.setItem('list', JSON.stringify(list));
                                todoList.innerHTML = '';
                                for (let p = 0; p < list.length; p++) {
                                  const todoItem = document.createElement('li');
                                  todoItem.textContent = `${list[p].title} - ${list[p].priority} - ${list[p].date}`;
                                  const deleteButton = document.createElement('button');
                                  deleteButton.textContent = 'Delete';
                                  deleteButton.addEventListener('click', function() {
                                    list.splice(p, 1);
                                    localStorage.setItem('list', JSON.stringify(list));
                                    todoList.innerHTML = '';
                                    for (let q = 0; q < list.length; q++) {
                                      const todoItem = document.createElement('li');
                                      todoItem.textContent = `${list[q].title} - ${list[q].