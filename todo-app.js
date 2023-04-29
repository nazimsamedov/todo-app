(function () {

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Write down todo...';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary', 'btn-secondary');
    button.disabled = true;
    button.textContent = 'Nothing to add';

    form.append(input);
    form.append(buttonWrapper);
    buttonWrapper.append(button);

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(name) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;
    item.id = new Date();

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Done';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Delete';

    item.append(buttonGroup);
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function createTodoApp(container, title = 'To-do list', key) {

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    // создаем массив для работы с объектими из localstorage
    let storageTodoArr = [];

    // если в localstorage есть данные, то парсим в массив
    if (localStorage.getItem(key) !== null) {
      storageTodoArr = JSON.parse(localStorage.getItem(key));
    }

    // цикл для работы с объектами в массиве
    for (let storageTodoObj of storageTodoArr) {
      // создаем элементы для юзера, соответсвующим объектам массива из localstorage
      let todoItem = createTodoItem(storageTodoObj.name);
      // проверяем статус готовности и в соответствии маркируем элемент для юзера
      if (storageTodoObj.done == true) {
        todoItem.item.classList.add('list-group-item-success');
        todoItem.doneButton.textContent = 'Not done';
      }
      // добавляем id и пушим в список дел для юзера
      todoItem.item.id = storageTodoObj.id;
      todoList.append(todoItem.item);

      // маркируем загруженные и выполненные дела в списке и в localstorage и перезаписываем localstorage
      todoItem.doneButton.addEventListener('click', () => {
        todoItem.item.classList.toggle('list-group-item-success');
        storageTodoArr = JSON.parse(localStorage.getItem(key));
        for (storageTodoObj of storageTodoArr) {
          if (storageTodoObj.id == todoItem.item.id && storageTodoObj.done == false) {
            storageTodoObj.done = true;
            todoItem.doneButton.textContent = 'Not done';
          } else if (storageTodoObj.id == todoItem.item.id && storageTodoObj.done == true) {
            storageTodoObj.done = false;
            todoItem.doneButton.textContent = 'Done';
          }
        }
        localStorage.setItem(key, JSON.stringify(storageTodoArr));
      });

      // удаляем загруженные дела из списка и из localstorage и перезаписываем localstorage
      todoItem.deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure?')) {
          todoItem.item.remove();
          // запись плохочитаема, но только так получилось избежать создания нового массива, которого требует метод filter, и который в свою очередь конфликтует с submit
          localStorage.setItem(key, JSON.stringify(JSON.parse(localStorage.getItem(key)).filter(storageTodoObj => storageTodoObj.id !== todoItem.item.id)));
        }
      });
    }

    // следим за инпутом и меняем визуал кнопки submit
    todoItemForm.input.addEventListener('input', () => {
      if (todoItemForm.input.value !== '') {
        todoItemForm.button.classList.remove('btn-secondary');
        todoItemForm.button.disabled = false;
        todoItemForm.button.textContent = 'Add to todo list';
      } else {
        todoItemForm.button.classList.add('btn-secondary');
        todoItemForm.button.disabled = true;
        todoItemForm.button.textContent = 'Nothing to add';
      }
    });

    // следим за созданием новых дел
    todoItemForm.form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      // создаем дело и пушим в список для юзера
      let todoItem = createTodoItem(todoItemForm.input.value);
      todoList.append(todoItem.item);

      // переопределяем массив таким образом, чтобы пустой localstorage не "ругался" на null, а в уже заполненный не дублировались старые объекты в localstorage
      storageTodoArr = JSON.parse(localStorage.getItem(key)) || [];

      // создаем и пушим новый объект дела в массив и перезаписываем localstorage
      storageTodoArr.push({
        name: todoItemForm.input.value,
        done: false,
        id: todoItem.item.id,
      });
      localStorage.setItem(key, JSON.stringify(storageTodoArr));

      // маркируем созданные и выполненные дела в списке и в localstorage и перезаписываем localstorage
      todoItem.doneButton.addEventListener('click', () => {
        todoItem.item.classList.toggle('list-group-item-success');
        storageTodoArr = JSON.parse(localStorage.getItem(key));
        for (storageTodoObj of storageTodoArr) {
          if (storageTodoObj.id == todoItem.item.id && storageTodoObj.done == false) {
            storageTodoObj.done = true;
            todoItem.doneButton.textContent = 'Not done';
          } else if (storageTodoObj.id == todoItem.item.id && storageTodoObj.done == true) {
            storageTodoObj.done = false;
            todoItem.doneButton.textContent = 'Done';
          }
        }
        localStorage.setItem(key, JSON.stringify(storageTodoArr));
      });

      // удаляем созданные дела из списка и из localstorage и перезаписываем localstorage
      todoItem.deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure?')) {
          todoItem.item.remove();
          localStorage.setItem(key, JSON.stringify(JSON.parse(localStorage.getItem(key)).filter(storageTodoObj => storageTodoObj.id !== todoItem.item.id)));
        }
      });

      // очищаем форму и отключаем кнопку submit
      todoItemForm.input.value = '';
      todoItemForm.button.classList.add('btn-secondary');
      todoItemForm.button.textContent = 'Nothing to add';
      todoItemForm.button.disabled = true;
    });
  }

  window.createTodoApp = createTodoApp;
})();