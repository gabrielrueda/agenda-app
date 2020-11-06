const ObservableArray = require("@nativescript/core").ObservableArray;
const Observable = require("@nativescript/core").Observable;
const platformModule = require("tns-core-modules/platform");
const height = 740;
const width = 370;
const todaysDate = new Date();
var layoutChoosen = "0";
var dialogs = require("tns-core-modules/ui/dialogs");

// Variables for All View Models:
var globalTasks = [];

//View Model for Today Page
function todayPageViewModel() {
    const vModel = new Observable();
    const tasks = new ObservableArray(globalTasks.filter(task => 
        (task.date.getDate() === todaysDate.getDate() && task.date.getMonth() === todaysDate.getMonth() && task.date.getFullYear() === todaysDate.getFullYear() ) || (task.type === "Quiz" || task.type === "Assignment" || task.type === "Test") && (task.date.getDate() === todaysDate.getDate()+1 && task.date.getMonth() === todaysDate.getMonth() && task.date.getFullYear() === todaysDate.getFullYear() ))
    );
    vModel.addButtonPos = [(width-110),(height-240)];
    vModel.set("tasks", tasks);

    vModel.goToAddTaskPage = function(args) {
        myFrame = args.object.page.frame;
        myFrame.navigate("/pages/addTask-page");
    }

    vModel.removeTask = function(args){
        taskParent = args.object.parent;
        taskName = taskParent.getChildAt(1).text;
        //For Local Tasks Variable
        for(i=0; i<tasks.length;i++){
            if(taskName === tasks._array[i].name){
                tasks.splice(i,1);
                break;
            }
        }
        //For Global Tasks Variable
        for(i=0; i<globalTasks.length;i++){
            if(taskName === globalTasks[i].name){
                globalTasks.splice(i,1);
                break;
            }
        }
    }

    return vModel;
}

//View Model for Add Task Page
function addTaskViewModel(){
    const viewModel = new Observable();
    var type = "";
    viewModel.minDate = todaysDate;
    viewModel.name = "";
    viewModel.class = "";
    viewModel.date = todaysDate;
    viewModel.dateLabel = "Date";

    viewModel.selectType = function(args){
        button = args.object;
        buttonRefresh(button.parent);
        button.class = "typeSelectorButtonPressed";
        type = button.text;
        console.log(type);
        if(type === "Test" || type === "Quiz"){
            viewModel.set("dateLabel",type + " Date");
        }else if(type === "Assignment" || type === "Homework"){
            viewModel.set("dateLabel","Due Date");
        }else{
            viewModel.set("dateLabel","Date");
        }
    }
    viewModel.addTask = function(args){
        // Use getFullYear() to get the year, getMonth() for month, and getDate() for day of the month
        if(viewModel.name != "" && viewModel.class != "" && type != ""){
            globalTasks.push(
                {name: viewModel.name, class: viewModel.class, date: viewModel.date, writtenDate: getWrittenDate(viewModel.date), type: type}
            );             
            myFrame = args.object.page.frame;
            myFrame.goBack();
        }else{
            dialogs.alert({
                title: "Sorry",
                message: "You must write all the information for your task.",
                okButtonText: "Okay"
            });
        }
    }

    viewModel.cancelTask = function(args){
        frame = args.object.page.frame;
        frame.goBack();
    }
    return viewModel;
}

function getWrittenDate(date){
    dateToCompare = new Date();
    options = ["Sunday","Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    for(x=0;x<7;x++){
        if(date.getDate() === dateToCompare.getDate() && date.getMonth() === dateToCompare.getMonth() && date.getFullYear() === dateToCompare.getFullYear()){
            if(x === 0){
                return "Today";
            }else if(x === 1){
                return "Tommorow"
            }else{
                return options[date.getDay()];
            }
        }
        dateToCompare.setDate(dateToCompare.getDate() + 1);
    }
    if(layoutChoosen === "0"){
        return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
    }else if(layoutChoosen === "1"){
        return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
    }else{
        return date.getFullYear() + "/" + date.getDate() + "/" + (date.getMonth()+1);
    }
}


function buttonRefresh(parent){
    for(i=0; i<parent.getChildrenCount(); i++){
        parent.getChildAt(i).class = "typeSelectorButton";
    }
}

//Use Selection Sort Algorithm to Sort Tasks
function sortTasks(array){
    swapped = true;
    while(swapped === true){
        swapped = false;
        for(i=1;i<array.length;i++){
            if(array[i-1].date > array[i].date){
                temp = array[i];
                array[i] = array[i-1];
                array[i-1] = temp;
                swapped = true;
            }
    }
    }
    return array;
}

function futurePageViewModel(){
    const vModel = new Observable();
    const tasks = new ObservableArray(sortTasks(globalTasks.filter(task => 
        (task.date.getDate() != todaysDate.getDate() || task.date.getMonth() != todaysDate.getMonth() || task.date.getFullYear() != todaysDate.getFullYear() ) && (task.type != "Quiz" || task.type != "Assignment" || task.type != "Test") && (task.date.getDate() != todaysDate.getDate()+1 || task.date.getMonth() != todaysDate.getMonth() || task.date.getFullYear() != todaysDate.getFullYear() )))
    );
    vModel.addButtonPos = [(width-110),(height-240)];
    vModel.set("tasks", tasks);

    vModel.goToAddTaskPage = function(args) {
        myFrame = args.object.page.frame;
        myFrame.navigate("/pages/addTask-page");
    }

    vModel.removeTask = function(args){
        taskParent = args.object.parent;
        taskName = taskParent.getChildAt(1).text;
        //For Local Tasks Variable
        for(i=0; i<tasks.length;i++){
            if(taskName === tasks._array[i].name){
                tasks.splice(i,1);
                break;
            }
        }
        //For Global Tasks Variable
        for(i=0; i<globalTasks.length;i++){
            if(taskName === globalTasks[i].name){
                globalTasks.splice(i,1);
                break;
            }
        }
    }

    return vModel;
}

function settingsPageViewModel(){
    const vModel = new Observable();
    vModel.text = "Hello World";

    vModel.layoutSelect = function(args){
        button = args.object;
        buttonRefresh(button.parent);
        button.class = "typeSelectorButtonPressed";
        layoutChoosen = button.id;
        for(var i=0;i<globalTasks.length;i++){
            globalTasks[i].writtenDate = getWrittenDate(globalTasks[i].date);
        }
    }
    return vModel;
}

exports.todayPageViewModel = todayPageViewModel;
exports.settingsPageViewModel = settingsPageViewModel;
exports.futurePageViewModel = futurePageViewModel;
exports.addTaskViewModel = addTaskViewModel;
