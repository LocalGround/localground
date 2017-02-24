define(["jquery", "backbone", "models/form", "collections/basePageable"], function ($, Backbone, Form, BasePageable) {
    "use strict";
    var Forms = BasePageable.extend({
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
