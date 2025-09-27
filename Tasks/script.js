function addTasks(){
    let buttonAdd = document.getElementById("addTask");
    buttonAdd.addEventListener("click", function(event){
        event.preventDefault();
        let taskName = document.getElementById("taskName").value;
        let dueDate = document.getElementById("dueDate").value;
        if(taskName === "" || dueDate === ""){
            alert("hello, you forgot something");
            return;
    }
        let taskList = document.getElementById("taskList");
        let newTask = document.createElement("li");
        newTask.className = "flex items-start sm:items-center justify-between gap-3 p-3 border rounded-md bg-white";
        newTask.innerHTML = `

        <div class="flex items-start gap-3">
            <input type="checkbox" class="mt-1 task-toggle">
            <div>
              <div class="task-name font-medium">${taskName}</div>
              <div class="text-xs text-slate-500 mt-1">Due: ${dueDate} • <span id="status" class="task-status text-xs text-orange-600">Pending</span></div>
            </div>
          </div>
          <div class="flex gap-2 items-center">
            <button class="edit-btn text-sky-600 text-sm hover:underline">Edit</button>
            <button class="delete-btn text-rose-600 text-sm hover:underline">Delete</button>
          </div>
        `;
        taskList.appendChild(newTask);
        document.getElementById("taskForm").reset();

}
    );
}
addTasks();