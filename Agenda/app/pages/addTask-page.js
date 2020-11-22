const { addTaskViewModel } = require("~/viewmodels/main-view-model");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = addTaskViewModel();
}

exports.onNavigatingTo = onNavigatingTo;
