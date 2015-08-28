define([
    "jquery",
    "underscore",
    "text!/static/backbone/js/templates/modals/errorModal.html",
    "backgrid-paginator"
], function ($, _, ModalTemplate) {
    "use strict";
    var Utilities = {
        displayServerError: function (event, request, settings) {
            //console.error(event, request, settings);
            var response = JSON.parse(request.responseText),
                template,
                key,
                detail = "";
            for (key in response) {
                detail += response[key];
            }
            template = _.template(ModalTemplate, {
                status: request.status,
                type: settings.type,
                url: settings.url,
                message: detail
            });
            $('body').find('#error-modal').remove();
            $('body').append(template);
            $('#error-modal').modal();
        },
        ensureRequiredParam: function (param) {
            if (!this[param]) {
                throw "\"" + param + "\" initialization parameter is required";
            }
        }
    };
    return Utilities;
});