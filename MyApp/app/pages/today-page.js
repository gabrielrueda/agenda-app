const { todayPageViewModel } = require("~/viewmodels/main-view-model");


function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = todayPageViewModel();
}

exports.onNavigatingTo = onNavigatingTo;
