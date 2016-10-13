define(["jquery", "backbone", "models/form"], function ($, Backbone, Form) {
    "use strict";
    var Forms = Backbone.Collection.extend({
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