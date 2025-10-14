const readTaskFromInput = function(titleInput, dateInput) {
    return {
        title: titleInput.value.trim(),
        date: dateInput.value ? new Date(dateInput.value) : null
    };
}

const validateTaskInput = function(taskInput) {
    const title = taskInput.title.trim();
    if (title.length === 0) {
        alert("Task title cannot be empty.");
        return false;
    }
    if (title.length < 3) {
        alert("Task title must be at least 3 characters long.");
        return false;
    }
    if (title.length > 255) {
        alert("Task title cannot be longer than 255 characters.");
        return false;
    }

    if (taskInput.date) {
        const inputDate = new Date(taskInput.date);
        const today = new Date();

        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (inputDate < today) {
            alert("Task date cannot be in the past.");
            return false;
        }
    }

    return true;
};

class Todo {
    #editIndex = -1;
    #searchPrompt = '';

    // title : string, completed : boolean, date : Date
    tasks = [];

    onEditIndexChanged = null;

    get editIndex() { return this.#editIndex; }

    #updateTaskFromInputs(index) {
        const titleInput = document.getElementById(`task${index}Text`);
        const dateInput = document.getElementById(`task${index}Date`);

        const updatedTask = readTaskFromInput(titleInput, dateInput);
        if (!validateTaskInput(updatedTask)) return false;

        this.updateTask(index, updatedTask);

        return true;
    }

    #releaseEditMode() {
        if (this.#editIndex < 0) {
            return true;
        }

        if (!this.#updateTaskFromInputs(this.#editIndex)) {
            // Validation failed
            return false;
        }

        return true;
    }

    #taskElementClicked(index, event) {
        // Ignore clicks on children
        const targetName = event.target.tagName.toLowerCase();
        if (targetName === 'button' || targetName === 'input') return;

        this.setEditIndex(index);
    }

    #createDeleteButton(index) {
        let button = document.createElement("button");
        button.className = 'iconBtn';
        button.title = 'Delete';
        button.type = 'button';
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg>';
        button.onclick = () => this.deleteTask(index);
        return button;
    }

    #getHighlightedTextElement(text, highlightString) {
        const container = document.createElement('span');

        if (!highlightString) {
            container.textContent = text;
            return container;
        }

        const lowerText = text.toLowerCase();
        const lowerHighlight = highlightString.toLowerCase();

        let lastIndex = 0;
        let index;

        while ((index = lowerText.indexOf(lowerHighlight, lastIndex)) !== -1) {
            if (index > lastIndex) {
                container.appendChild(document.createTextNode(text.slice(lastIndex, index)));
            }

            const highlight = document.createElement('span');
            highlight.className = 'highlight';
            highlight.textContent = text.slice(index, index + highlightString.length);
            container.appendChild(highlight);

            lastIndex = index + highlightString.length;
        }

        if (lastIndex < text.length) {
            container.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        return container;
    }


    #createTaskElement(task, index, searchString = "") {
        let taskElement = document.createElement("div");
        taskElement.className = "task";
        taskElement.onclick = (event) => this.#taskElementClicked(index, event);

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox"
        checkbox.id = `task${index}Checkbox`;
        checkbox.checked = task.completed;
        checkbox.onclick = (event) => this.setTaskCompleted(index, event.target.checked);
        taskElement.appendChild(checkbox);

        let checkboxLabel = document.createElement("label");
        checkboxLabel.htmlFor = checkbox.id;
        checkboxLabel.appendChild(this.#getHighlightedTextElement(task.title, searchString));
        taskElement.appendChild(checkboxLabel);

        if (task.date) {
            let dateText = document.createElement("span");
            dateText.className = "date";
            dateText.innerText = new Intl.DateTimeFormat().format(task.date);
            taskElement.appendChild(dateText);
        }

        let deleteButton = this.#createDeleteButton(index);
        taskElement.appendChild(deleteButton);

        return taskElement;
    }

    #createTaskEditElement(task, index) {
        let taskElement = document.createElement("div");
        taskElement.className = "task editMode";

        let titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.id = `task${index}Text`;
        titleInput.className = "taskInput";
        titleInput.value = task.title;
        taskElement.appendChild(titleInput);
        
        let dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.id = `task${index}Date`;
        dateInput.className = "taskDateInput";
        dateInput.value = task.date?.toISOString().split('T')[0] ?? '';
        taskElement.appendChild(dateInput);

        let deleteButton = this.#createDeleteButton(index);
        taskElement.appendChild(deleteButton);

        return taskElement;
    }

    setEditIndex(index) {
        if (index >= this.tasks.length) {
            throw new RangeError("Edit index out of range");
        }

        if (!this.#releaseEditMode()) {
            // Validation failed
            return;
        }
        this.#editIndex = index;
        this.onEditIndexChanged?.(index);

        this.draw();
    }

    draw() {
        let todoList = document.getElementById("todoList");

        if (this.tasks.length === 0) {
            todoList.innerHTML = "Looks like somebody has nothing to do &#x1F440;";
            return;
        }

        todoList.innerHTML = '';
        let matches = 0;
        const titleFilter = this.#searchPrompt.length >= 2 ? this.#searchPrompt.toLowerCase() : '';
        for (let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i];
            if (!task.title.toLowerCase().includes(titleFilter)) continue;

            const taskElement = this.#editIndex === i ? 
                this.#createTaskEditElement(task, i) : 
                this.#createTaskElement(task, i, titleFilter);

            matches++;
            todoList.appendChild(taskElement);
        }

        if (matches === 0) {
            todoList.innerHTML = "Nothing that matches your prompt was found&#x1F480;";
            return;
        }
    }

    addTask(task) {
        const newTask = { 
            title: task.title,
            completed: false,
            date: task.date 
        };
        this.tasks.push(newTask);

        this.draw();
        this.saveToLocalStorage();
    }

    setTaskCompleted(index, value) {
        this.tasks[index].completed = value;

        this.draw();
        this.saveToLocalStorage();
    }

    updateTask(index, updatedTask) {
        this.tasks[index].title = updatedTask.title;
        this.tasks[index].date = updatedTask.date;

        this.draw();
        this.saveToLocalStorage();
    }

    deleteTask(index) {
        if (!this.#releaseEditMode()) return;

        this.#editIndex = -1;
        let editIndex = this.#editIndex;
        if (confirm("Are you sure you want to delete this task?")) {
            this.tasks.splice(index, 1);
            this.#editIndex = editIndex;

            if (this.#editIndex === index) this.setEditIndex(-1);
            else if (this.#editIndex > index) this.setEditIndex(editIndex - 1);
            
            this.draw();
            this.saveToLocalStorage();
        } else {
            this.#editIndex = editIndex;
        }
    }

    saveToLocalStorage() {
        const json = JSON.stringify(this);
        localStorage.setItem('todo', json);
    }

    updateSearch(prompt) {
        this.#searchPrompt = prompt;

        this.draw();
    }

    static loadFromLocalStorage() {
        const json = localStorage.getItem('todo');
        let result;
        try {
            result = JSON.parse(json);
        } catch (e) {
            if (e instanceof SyntaxError) {
                result = null;
            } else {
                throw e;
            }
        }
        if (result) {
            let todo = Object.assign(new Todo, result);
            // Convert task dates from string to Date
            todo.tasks = todo.tasks.map(task => ({
                ...task,
                date: task.date ? new Date(task.date) : null
            }));
        return todo;
        }
        return null;
    }
}

let currentTodo;

const formSubmitted = function(event) {
    event.preventDefault();

    if (currentTodo.index >= 0) {
        currentTodo.setEditIndex(-1);
        return;
    }

    const titleInput = document.getElementById("taskText");
    const dateInput = document.getElementById("taskDate");

    const task = readTaskFromInput(titleInput, dateInput);
    if (!validateTaskInput(task)) return;

    currentTodo.addTask(task);

    titleInput.value = '';
    dateInput.value = '';
};

const documentClicked = function(event) {
    if (event.target.closest(".task")) return;
    currentTodo.setEditIndex(-1);
}

const editIndexChanged = function(index) {
    document.getElementById("submitButton").disabled = index >= 0;
    document.getElementById("searchField").disabled = index >= 0;
}

const updateSearch = function(event) {
    currentTodo.updateSearch(event.target.value.trim());
}

const setUp = function() {
    currentTodo = Todo.loadFromLocalStorage() ?? new Todo();
    currentTodo.onEditIndexChanged = editIndexChanged;
    currentTodo.draw();

    document.getElementById("taskDate").min = new Date().toISOString().split('T')[0];

    const todoForm = document.getElementById("todoForm");
    todoForm.addEventListener("submit", formSubmitted);
    todoForm.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && currentTodo.editIndex >= 0) {
            currentTodo.setEditIndex(-1);
        }
    });

    document.addEventListener("pointerdown", documentClicked);

    const searchField = document.getElementById("searchField"); 
    searchField.addEventListener("input", updateSearch);
    searchField.value = "";
}

window.onload = (_) => setUp();
