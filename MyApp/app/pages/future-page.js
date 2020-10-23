const { futurePageViewModel } = require("~/viewmodels/main-view-model");


function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = futurePageViewModel();
}

exports.onNavigatingTo = onNavigatingTo;
