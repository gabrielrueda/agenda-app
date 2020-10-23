const ObservableArray = require("@nativescript/core").ObservableArray;
const Observable = require("@nativescript/core").Observable;
const platformModule = require("tns-core-modules/platform");
const height = platformModule.screen.mainScreen.heightDIPs;
const width = platformModule.screen.mainScreen.widthDIPs;
var dialogs = require("tns-core-modules/ui/dialogs");

// Variables for All View Models:
var globalTasks = [
    {name: "Sample0", class: "Math", day: 24, month: 1, type: "Homework"},
    {name: "Sample1", class: "Math", day: 23, month: 1, type: "Homework"},
    {name: "Sample2", class: "Math", day: 24, month: 1, type: "Homework"},
    {name: "Sample3", class: "Math", day: 23, month: 1, type: "Homework"}
];

//View Model for Today Page
function todayPageViewModel() {
    const vModel = new Observable();
    const tasks = new ObservableArray(globalTasks.filter(task => task.day === (new Date().getDate())));
    vModel.addButtonPos = [(width-110),(height-240)];
    vModel.set("tasks", tasks);

    vModel.goToAddTaskPage = function(args) {
        myFrame = args.object.page.frame;
        globalTasks = tasks._array;
        myFrame.navigate("/pages/addTask-page");
    }

    vModel.removeTask = function(args){
        taskParent = args.object.parent;
        taskName = taskParent.getChildAt(1).text;

        for(i=0; i<tasks.length;i++){
            if(taskName === tasks._array[i].name){
                tasks.splice(i,1);
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
    viewModel.minDate = new Date();
    viewModel.name = "";
    viewModel.class = "";
    viewModel.date = new Date();
    viewModel.dateLabel = "Datee";

    viewModel.selectType = function(args){
        button = args.object;
        buttonRefresh(button.parent);
        button.class = "typeSelectorButtonPressed";
        type = button.text;
        if(type === "Test" || type === "Quiz"){
            viewModel.dateLabel = type + " Date";
            console.log("Test or quiz")
        }else if(type === "Assignment" || type === "Homework"){
            viewModel.dateLabel = "Due Date";
        }else{
            viewModel.dateLabel = "Date";
        }
    }
    viewModel.addTask = function(args){
        // Use getFullYear() to get the year, getMonth() for month, and getDate() for day of the month
        if(viewModel.name != "" && viewModel.class != "" && type != ""){
            globalTasks.push(
                {name: viewModel.name, class: viewModel.class, day: viewModel.date.getDate(), month: viewModel.date.getMonth(), type: type}
            );             
            myFrame = args.object.page.frame;
            myFrame.navigate("/pages/today-page");
        }else{
            dialogs.alert({
                title: "Sorry",
                message: "You must write all the information for your task.",
                okButtonText: "Okay"
            });
        }
    }
    return viewModel;
}

function buttonRefresh(parent){
    for(i=0; i<parent.getChildrenCount(); i++){
        parent.getChildAt(i).class = "typeSelectorButton";
    }
}

function futurePageViewModel(){
    const vModel = new Observable();
    const tasks = new ObservableArray(globalTasks);
    vModel.set("tasks", tasks);

    vModel.removeTask = function(args){
        taskParent = args.object.parent;
        taskName = taskParent.getChildAt(1).text;

        for(i=0; i<tasks.length;i++){
            if(taskName === tasks._array[i].name){
                tasks.splice(i,1);
                break;
            }
        }
    }

    return vModel;
}

exports.todayPageViewModel = todayPageViewModel;
exports.futurePageViewModel = futurePageViewModel;
exports.addTaskViewModel = addTaskViewModel;
