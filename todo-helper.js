function TodoHelper() {

    let todoH = this;


    todoH.taskFilterer = function (taskTab,tasks) {
        let allTasks = tasks;
        switch (taskTab) {
            case "AllTasks":
                return allTasks.filter(task => !task.deleted);
            case "Primary":
                return allTasks.filter(task => !task.delted && task.primary);
            case "Secondary":
                return allTasks.filter(task => !task.deleted && !task.primary);
            case "Completed":
                return allTasks.filter(task => !task.deleted && task.completed);
            case "Incomplete":
                return allTasks.filter(task => !task.deleted && !task.completed);
            case "Deleted":
                return allTasks.filter(task => task.deleted);
            case "Duplicate":
                return allTasks.filter((task, index, self) => 
                    self.findIndex(t => t.name === task.name) !== index
                );
            default:
                return allTasks.filter(task => !task.deleted);
        }
    }

    todoH.validateTaskName = function (taskName){
        return /^(?!.* {2})[A-Za-z0-9 ]{1,100}$/.test(taskName);
    }

    todoH.taskSorter = function (tasks){
       return tasks = tasks.sort((a,b) => Number(a.id.split("_")[1]) - Number(b.id.split("_")[1]));
    } 

    todoH.alertPopper = function (message,error){
       $("body").find(".alert-popper").remove();
       let status = error ? "error" : "tick";
       let color = error ? "#F44336" : "#44A047";
       let popper = `
          <div class="alert-popper" style="border-top: 5px solid ${color};">
              <img src="images/${status}.png" height="25px" width="25px">
              <p class="popper-text">${message}</p>
          </div>
       `;
       $("body").append(popper);
    }

}

let TD_Helper = new TodoHelper();






