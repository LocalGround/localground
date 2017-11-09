define(["jquery", "backbone", "models/form", "collections/basePageableWithProject"],
    function ($, Backbone, Form, BasePageableWithProject) {
    "use strict";
    var Forms = BasePageableWithProject.extend({
        model: Form,
        name: 'Forms',
        key: 'forms',
        url: '/api/0/forms/',
        parse: function (response) {
            return response.results;
        }
    });
    return Forms;
});
