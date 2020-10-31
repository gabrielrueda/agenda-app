const { settingsPageViewModel } = require("~/viewmodels/main-view-model");


function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = settingsPageViewModel();
}

exports.onNavigatingTo = onNavigatingTo;
