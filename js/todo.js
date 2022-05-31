// declaramos el array que usaremos para añadir o eliminar elementos
let todoList = [];

// este if lee si el item existe en el localStorage, si no, lo crea
if (!localStorage.getItem('todo-list')) {
    localStorage.setItem('todo-list', '');
} else {
    todoList = JSON.parse(localStorage.getItem('todo-list'));
}

// obtenemos los elementos del documento y los seteamos a sus variables
todoDiv = document.getElementById('todo-list');
newTask = document.getElementById('new-task');
addTask = document.getElementById('add-task');
taskDone = document.getElementById('task-done');
taskUndone = document.getElementById('task-undone');
getTasks = document.getElementById('get-tasks');

// aquí declaramos los eventos que utilizarán los botones
addTask.addEventListener('click', addNewTask);
taskDone.addEventListener('click', getCompleteTasks);
taskUndone.addEventListener('click', getUncompleteTasks);
getTasks.addEventListener('click', getTask);

function addNewTask() {
    // when button is pressed try to add the task to the list
    let taskValue = newTask.value.trim();
    
    // si el valor viene vacío, lanza una alerta y no continúa
    if (taskValue == '') {
        alert ('Escribe una nueva tarea');
        return false;
    }

    // hace un llamado a una función que se encarga de verificar si el valor
    // ya existe en el array, si sí no continúa
    if (newTaskExist(taskValue)) {
        alert('La tarea ya existe');
        resetInput();
        return false;
    }

    // se hace el push al array global
    todoList.push({"id": newID(), "task": taskValue, "completed": false});

    // esta función setea el array tal como se encuentra en este momento
    setItem();

    // limpiamos la caja del input
    resetInput();
    
    // refrescamos la vista
    getTask();
}

function newID() {
    // creamos una ID única para cada elemento
    return (new Date().getTime()).toString(36);
}


function resetInput() {
    // cada vez que se invoca esta función se limpia el input y se le pone focus
    newTask.value = '';
    newTask.focus();
}

function newTaskExist(value) {
    // check if the task already exist in the array
    return todoList.some(key => {
        return key["task"] === value;
    });
}

function setItem() {
    // cada vez que se invoca setea el array en el localstorage
    return localStorage.setItem('todo-list', JSON.stringify(todoList));
}

function getTask() {
    // get data from the local storage
    todoDiv.innerHTML = '';

    // si no hay ninguna tarea, mostramos un mensaje
    if (todoList.length == 0) {
        todoDiv.innerHTML = `
        <div class="lista-vacia">
            No hay tareas.
        </div>
        `    
    }

    for (let value of todoList) {
        todoDiv.innerHTML += `
        <div onclick="toggleTask('${value.id}')" class='tarea'>
            <span ${ value.completed ? 
                'style="text-decoration: line-through;"' : '' }>
                ${value.task}
            </span>
            <span>
                ${value.completed ? '<i class="ico-ok icofont-check-circled"></i>' : '<i class="ico-error icofont-close-circled"></i>'}
            </span>
            <span onclick="removeTask('${value.id}')"><i class="ico-trash icofont-trash"></i></span>
        </div>
        `;
    }
}

function getCompleteTasks() {
    // aqui solo mostramos las tareas que se encuentran realizadas
    todoDiv.innerHTML = '';
    todoList.map(value => {
        if (value["completed"]) {
            todoDiv.innerHTML += `
                <div onclick="toggleTask('${value.id}')" class='tarea'>
                    <span ${ value.completed ? 
                        'style="text-decoration: line-through;"' : '' }>
                        ${value.task}
                    </span>
                    <span>
                        ${value.completed ? 
                            '<i class="ico-ok icofont-check-circled"></i>' : 
                            '<i class="ico-error icofont-close-circled"></i>'
                        }
                    </span>
                    <span onclick="removeTask('${value.id}')">
                        <i class="ico-trash icofont-trash"></i>
                    </span>
                </div>
            `;
        }
    });
}

function getUncompleteTasks() {
    // aqui solo mostramos las tareas que no se encuentran realizadas
    todoDiv.innerHTML = '';
    todoList.map(value => {
        if (!value["completed"]) {
            todoDiv.innerHTML += `
                <div onclick="toggleTask('${value.id}')" class='tarea'>
                    <span ${ value.completed ? 
                        'style="text-decoration: line-through;"' : '' }>
                        ${value.task}
                    </span>
                    <span>
                        ${value.completed ? '<i class="ico-ok icofont-check-circled"></i>' : '<i class="ico-error icofont-close-circled"></i>'}
                    </span>
                    <span onclick="removeTask('${value.id}')"><i class="ico-trash icofont-trash"></i></span>
                </div>
            `;
        }
    });
}

function toggleTask(id) {
    // al ejecutar esta función cambiamos el status de completed
    Object.values(todoList).map(key => {
        if (key["id"] == id) key["completed"] = !key["completed"];
    });

    // seteamos el array ya con el cambio realizado
    setItem();
    // obtenemos la lista completa de las tareas
    getTask();
}

function removeTask(id) {
    // esta función se encarga de eliminar un elemento del array y recibe el id a eliminar
    // recorremos el objeto con map y únicamente se eliminar el deseado
    Object.values(todoList).map((key, idx) => {
        if (key["id"] == id) todoList.splice(idx, 1)
    });

    // se vuelve a setear el array en localstorage sin el elemento eliminado
    setItem();

    // se refrescan los elementos
    getTask();
}

getTask();