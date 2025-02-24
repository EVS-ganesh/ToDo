let TodoS = new TodoStore();
let TodoH = new TodoHelper();

function TodoActions() {

    let todoA = this;

    // does the initial tasks
    todoA.init = function () {
        let Tabs = TodoS.tabData;
        
        if (TodoS.isMenu) {
            for (tab in Tabs) {
                if (Tabs[tab] && tab !== "Deleted") {
                    todoA.generateAllTask(tab);
                    break;
                } else {
                    todoA.generateDeletedTasks();
                }
            }
        } else {
            todoA.generateAllTask("alltasks");
        }
    }

    // slides menu 
    todoA.toggleMenu = function () {
        let isMenu = TodoS.getMenuData(),
            menu = $(".td-list-container .td-menu-container"),
            tasks = $(".td-list-container .td-task-container");
    
        if (Number(isMenu)) {
            menu[0].classList.remove("menu-open");
            tasks[0].classList.remove("container-dec");
    
            menu[0].classList.add("menu-close");
            tasks[0].classList.add("container-inc");
    
            TodoS.setMenuData(0);
        } else {
            menu[0].classList.remove("menu-close");
            tasks[0].classList.remove("container-inc");
    
            menu[0].classList.add("menu-open");
            tasks[0].classList.add("container-dec");
    
            TodoS.setMenuData(1);
        }
    };


    // search tasks
    todoA.searchTasks = function (event) {

        let previousTab = TodoS.previousTab ? TodoS.previousTab.attr("data") : "AllTasks";
        let Tasks = TodoH.taskFilterer(previousTab,TodoS.getTaskData("alltasks"));
        let TaskName = event.target.value;
        Tasks = Tasks.filter(task => task.name.includes(TaskName));
        todoA.generateAllTask(previousTab,Tasks);
    }
    

    // changes the tab
    todoA.changeTab = function (event) {
        let Tabs = TodoS.tabData;
        let prev_element = TodoS.previousTab[0] ? TodoS.previousTab : $("#All_TS");
        let curr_element = event.target.id ? $("#" + event.target.id) : prev_element;
        let tabName = curr_element.attr("data");
        Object.keys(Tabs).forEach(tab => Tabs[tab] = false);
        if (Tabs.hasOwnProperty(tabName)) {
            Tabs[tabName] = true;
        }
        if (curr_element.attr("id")) { curr_element.addClass("on-tab-switch"); }
        if (prev_element.attr && prev_element.attr("id") !== curr_element.attr("id")) { prev_element.removeClass("on-tab-switch"); }
        TodoS.setPrevNode(curr_element);
        if(tabName == "AllTasks"){
           $("#task_creator").show();
        }else{
           $("#task_creator").hide();
        }
        todoA.generateAllTask(tabName);
    }

    // generating tasks according to the tasks tab
    todoA.generateAllTask = function (tasksTab,givenTasks) {

        let Container = $("#task_store"),
            tasks = tasksTab !== "Deleted" ? TodoH.taskFilterer(tasksTab,TodoS.getTaskData("alltasks")) : TodoH.taskFilterer(tasksTab,TodoS.getTaskData("deleted"));

            tasks = givenTasks ? givenTasks : tasks;

            tasks = TodoH.taskSorter(tasks);

        // refresh the container
        Container.html("");
        $(".td-list-container .td-task-store").css({
            "height": "60%",
            "width": "70%"
        });

        if (tasks.length) {
            tasks.forEach((task) => {

                let ID = task.id,
                    Name = task.name,
                    taskType = task.primary ? "primary" : "secondary",
                    complete = task.completed ? "completed" : "incomplete";


                let taskEle = !task.deleted ? `
                  <div class="td-task" id="${ID}">
                     <img src="images/${complete}.png" title="task completion" onclick="TD_Actions.toggleCompletion(event)" class="tsk-actions tsk-radio">
                      <p class="tsk-display" id="${ID}_name">${Name}</p>
                     <div class="tsk-actions-ped">
                             <img title="edited" src="images/done.png" alt="" onclick="" class="tsk-actions tsk-done hide">
                             <img title="prioritize" src="images/${taskType}.png" alt="" onclick="TD_Actions.togglePrimary(event)" class="tsk-actions tsk-star">
                             <img title="edit task" src="images/pen.png" alt="" onclick="TD_Actions.editTask(event)" class="tsk-actions tsk-pen"">
                             <img title="move to bin" src="images/bin.png" onclick="TD_Actions.removeTask(event)" alt="" class="tsk-actions tsk-delete remove-tsk">
                     </div>
                  </div>
               ` : `
               <div class="td-task" id="${ID}">
                     <p class="tsk-display">${Name}</p> 
                     <div class="tsk-actions-ped">
                            <img src="images/restore.png" title="restore" onclick="TD_Actions.recoverTask(event)" alt="" class="tsk-actions tsk-recover remove-tsk">
                            <img src="images/remove.png" title="remove" onclick="TD_Actions.removeFromDeleted(event)" alt="" class="tsk-actions tsk-remove remove-tsk">
                     </div>
                  </div>
               `;

                if (!task.deleted || (task.deleted && tasksTab == "Deleted")) {
                    Container.append(taskEle);
                }
            })
        }else{

            $(".td-list-container .td-task-store").css({
                "height": "90%",
                "width": "90%"
            });

            tasksTab = tasksTab == "AllTasks" ? "Common" : tasksTab; 

            let content = `
               <div class="empty-tasks">
                   <img src="images/notasks.png" class="no-tasks">
                   <p class="not-found">No ${tasksTab} tasks.</p>
               </div>
             `
            Container.append(content);
        }
    }

    // adds the task
    todoA.addTask = function (event) {

        if (event.type === "click" || (event.type === "keyup" && event.keyCode === 13)) {

            $(".td-list-container .td-task-store").css({
                "height": "60%",
                "width": "70%"
            });

            let Container = $("#task_store");
            Container.find(".empty-tasks").remove(); 
            let Name = $("#input_task").val();
            let ID = "tsk_" + Date.now();

            if (TodoH.validateTaskName(Name)) {

                let task = `
          <div class="td-task secondary-task" id="${ID}">
             <img src="images/incomplete.png" title="task completion" class="tsk-actions tsk-radio incomplete-tsk" onclick="TD_Actions.toggleCompletion(event)">
             <p class="tsk-display" id="${ID}_name">${Name}</p>
             <div class="tsk-actions-ped">
                     <img title="edited" src="images/done.png" alt="" onclick="" class="tsk-actions tsk-done hide">
                     <img title="prioritize" src="images/secondary.png" alt="" onclick="TD_Actions.togglePrimary(event)" class="tsk-actions tsk-star">
                     <img title="edit task" src="images/pen.png" alt="" onclick="TD_Actions.editTask(event)" class="tsk-actions tsk-pen">
                     <img title="move to bin" src="images/bin.png" alt="" onclick="TD_Actions.removeTask(event)" class="tsk-actions tsk-delete">
             </div>
          </div>
       `;

                Container.append(task);


                let taskData = {
                    name: Name,
                    id: ID,
                    primary: false,
                    deleted: false,
                    completed: false
                }

                $("#input_task").val("");
                TodoS.addTask(taskData);
            } else {
                TodoH.alertPopper("The Taskname character limit is 100 and only words and numbers are allowed symbols not allowed.",true);
            }
        }
    }

    // removes the task from tasks
    todoA.removeTask = function (event) {
       let tasksTab = TodoS.previousTab ? TodoS.previousTab.attr("data") : "AllTasks",
       Element = event.target.parentElement.parentElement,
       ID = Element.id;
       task = TodoS.getTaskData("alltasks").filter(task => task.id === ID)[0];

       TodoS.addToBin(task);
       Element.remove();

       let Container = $("#task_store");
        if(!Container[0].children.length){
            $(".td-list-container .td-task-store").css({
                "height": "90%",
                "width": "90%"
            });

            tasksTab = tasksTab == "AllTasks" ? "Common" : tasksTab; 

            let content = `
               <div class="empty-tasks">
                   <img src="images/notasks.png" class="no-tasks">
                   <p class="not-found">No ${tasksTab} tasks.</p>
               </div>
             `
            Container.append(content);
        }
    }

    // removes the task from bin
    todoA.removeFromDeleted = function (event) {
        let tasksTab = TodoS.previousTab ? TodoS.previousTab.attr("data") : "Deleted",
        Element = event.target.parentElement.parentElement,
        ID = Element.id,
        task = TodoS.getTaskData("deleted").filter(task => task.id === ID)[0];

        TodoS.removeFromBin(task);
        Element.remove();

        let Container = $("#task_store");
        if(!Container[0].children.length){
            $(".td-list-container .td-task-store").css({
                "height": "90%",
                "width": "90%"
            });

            let content = `
               <div class="empty-tasks">
                   <img src="images/notasks.png" class="no-tasks">
                   <p class="not-found">No ${tasksTab} tasks.</p>
               </div>
             `
            Container.append(content);
        }
    }

    // recovers the task from bin
    todoA.recoverTask = function (event) {
        let tasksTab = TodoS.previousTab ? TodoS.previousTab.attr("data") : "Deleted",
        Element = event.target.parentElement.parentElement;
        ID = Element.id,
        task = TodoS.getTaskData("deleted").filter(task => task.id === ID)[0];

        TodoS.recoverFromBin(task);
        todoA.generateAllTask("Deleted");

        let Container = $("#task_store");
        if(!Container[0].children.length){
            $(".td-list-container .td-task-store").css({
                "height": "90%",
                "width": "90%"
            });
            let content = `
               <div class="empty-tasks">
                   <img src="images/notasks.png" class="no-tasks">
                   <p class="not-found">No ${tasksTab} tasks.</p>
               </div>
             `
            Container.append(content);
        }
    }


    // task editing
    todoA.onEditTaskEnter = function (event,id) {  // saves by enter
       let TaskName = $("#"+event.target.id);
       if(TodoH.validateTaskName(TaskName[0].innerText) && event.keyCode === 13){
         let taskData = {
            id : id,
            name : TaskName[0].innerText
         }
         TodoS.editTask(taskData);
         TaskName[0].onkeyup = null;
         TaskName[0].contentEditable = false;
         TodoH.alertPopper("Task Name is changed successfully",false);
         return true;
       }else{
         TodoH.alertPopper("The Taskname character limit is 100 and only words and numbers are allowed symbols not allowed.",true);
         return false;
       }
    }

    todoA.onEditTaskClick = function (event,id) {  // saves by click
        let TaskName = $("#"+id+"_name");
        let Done = $(event.target);
        if(TodoH.validateTaskName(TaskName[0].innerText) && event.type === "click"){
          let taskData = {
             id : id,
             name : TaskName[0].innerText
          }
          TodoS.editTask(taskData);
          TaskName[0].onkeyup = null;
          TaskName[0].contentEditable = false;
          Done.onclick = null;
          TodoH.alertPopper("Task Name is changed successfully",false);
          return true;
        }else{
          TodoH.alertPopper("The Taskname character limit is 100 and only words and numbers are allowed symbols not allowed.",true);
          return false;
        }
     }

    todoA.editTask = function (event) {
        let PenParent = event.target.parentElement,
        TaskID = PenParent.parentElement.id,
        Done = PenParent.children[0],
        TaskName = PenParent.parentElement.children[1],
        siblings = Array.from(PenParent.children).slice(1); // Get other children except Done

        // Show Done button
        Done.classList.remove("hide");

        // Hide other children (excluding Done)
        siblings.forEach(child => child.classList.add("hide"));
        PenParent.parentElement.children[0].classList.add("hide");

        TaskName.contentEditable = true;
        TaskName.focus();
        TaskName.onkeydown = function(event){
            if(event.keyCode === 13 ){
                event.preventDefault();
                if(todoA.onEditTaskEnter(event,TaskID)){
                    Done.classList.add("hide");
                    siblings.forEach(child => child.classList.remove("hide"));
                    PenParent.parentElement.children[0].classList.remove("hide"); 
                }
            }
        };

        Done.onclick = function(event){
            event.preventDefault();
            if(todoA.onEditTaskClick(event,TaskID)){
                Done.classList.add("hide");
                siblings.forEach(child => child.classList.remove("hide"));
                PenParent.parentElement.children[0].classList.remove("hide"); 
            }
        }
    }

    todoA.togglePrimary = function (event) {
        let star = event.target,
        StarParent = event.target.parentElement,
        TaskId = StarParent.parentElement.id,
        AllTasks = TodoS.getTaskData("alltasks"),
        TaskData = AllTasks.filter(task => task.id === TaskId)[0];
      
        if(TaskData.primary){
            star.src = "images/secondary.png";
            TaskData.primary = false;
        }else{
            star.src = "images/primary.png";
            TaskData.primary = true;
        }
      
        TodoS.togglePrimary(TaskData);

        if(TodoS.previousTab && TodoS.previousTab.attr("data") === "Primary"){
            todoA.generateAllTask("Primary");
        }else if(TodoS.previousTab && TodoS.previousTab.attr("data") === "Secondary"){
            todoA.generateAllTask("Secondary");
        }
    }


    todoA.toggleCompletion = function (event) {
        let complete = event.target,
        TaskId = complete.parentElement.id,
        AllTasks = TodoS.getTaskData("alltasks"),
        TaskData = AllTasks.filter(task => task.id === TaskId)[0];
      
        if(TaskData.completed){
            complete.src = "images/incomplete.png";
            TaskData.completed = false;
        }else{
            complete.src = "images/completed.png";
            TaskData.completed = true;
        }
      
        TodoS.toggleCompleted(TaskData);

        if(TodoS.previousTab && TodoS.previousTab.attr("data") === "Completed"){
            todoA.generateAllTask("Completed");
        }else if(TodoS.previousTab && TodoS.previousTab.attr("data") === "Incomplete"){
            todoA.generateAllTask("Incomplete");
        }
    }

    

    todoA.init();
}

let TD_Actions = new TodoActions();

// trigger click event;
$("#All_TS").click();