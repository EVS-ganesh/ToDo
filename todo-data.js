function TodoStore() {
    let todoD = this;

    todoD.isMenu = false;
    todoD.previousTab = "";

    todoD.tabData = {
        AllTasks: true,
        Primary: false,
        Secondary: false,
        Incomplete: false,
        Completed: false,
        Deleted: false
    };

    let defaultData = {
        alltasks: [],
        deleted: []
    };

    todoD.init = function () {
        todoD.taskData = JSON.parse(localStorage.getItem("todo-storage")) || defaultData;
        localStorage.setItem("todo-storage", JSON.stringify(todoD.taskData));
        localStorage.setItem("tab-data",JSON.stringify(todoD.tabData));
        localStorage.setItem("menu-open",0);
    };

    todoD.getMenuData = function (){
        return localStorage.getItem("menu-open");
    }

    todoD.setMenuData = function (data){
        return localStorage.setItem("menu-open", data);
    }

    todoD.getTabData = function (data) {
        return todoD.tabData[data];
    }

    todoD.setTabData = function (dataName, data) {
        todoD.tabData[dataName] = data;
        localStorage.setItem("todo-storage", JSON.stringify(todoD.tabData));
    }

    todoD.getTaskData = function (data) {
        return todoD.taskData[data];
    };

    todoD.setTaskData = function (dataName, data) {
        todoD.taskData[dataName] = data;
        localStorage.setItem("todo-storage", JSON.stringify(todoD.taskData));
    };

    todoD.setPrevNode = function (Node) {
        todoD.previousTab = Node;
    };

    todoD.addTask = function (taskData) {
        let allTasks = todoD.getTaskData("alltasks");
        allTasks.push(taskData);
        todoD.setTaskData("alltasks", allTasks);
    };

    todoD.editTask = function (taskData) {
        let allTasks = todoD.getTaskData("alltasks");
        allTasks.forEach(task => {
            if (task.id === taskData.id) {
                task.name = taskData.name;
            }
        });
        todoD.setTaskData("alltasks", allTasks);
    }

    todoD.togglePrimary = function (taskData) {
        let allTasks = todoD.getTaskData("alltasks");
        allTasks.forEach(task => {
            if (task.id === taskData.id) {
                task.primary = taskData.primary;
            }
        });
        todoD.setTaskData("alltasks", allTasks);
    };

    todoD.toggleCompleted = function (taskData) {
        let allTasks = todoD.getTaskData("alltasks");
        allTasks.forEach(task => {
            if (task.id === taskData.id) {
                task.completed = taskData.completed;
            }
        });
        todoD.setTaskData("alltasks", allTasks);
    };

    todoD.addToBin = function (taskData) {
        let allTasks = todoD.getTaskData("alltasks").filter(task => task.id !== taskData.id);
        let deletedTasks = todoD.getTaskData("deleted");
        taskData.deleted = true;
        deletedTasks.push(taskData);
        todoD.setTaskData("alltasks", allTasks);
        todoD.setTaskData("deleted", deletedTasks);
    };

    todoD.recoverFromBin = function (taskData) {
        let deletedTasks = todoD.getTaskData("deleted").filter(task => task.id !== taskData.id);
        let allTasks = todoD.getTaskData("alltasks");
        taskData.deleted = false;
        allTasks.push(taskData);
        todoD.setTaskData("alltasks", allTasks);
        todoD.setTaskData("deleted", deletedTasks);
    };

    todoD.removeFromBin = function (taskData) {
        let deletedTasks = todoD.getTaskData("deleted").filter(task => task.id !== taskData.id);
        todoD.setTaskData("deleted", deletedTasks);
    };

    this.init();
}
