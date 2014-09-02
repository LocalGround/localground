define(["jquery", "backbone", "models/form"], function($, Backbone, Form) {
    localground.collections.Forms = Backbone.Collection.extend({
        model: Form,
		name: 'Forms',
        url: '/api/0/forms/',
		parse : function(response) {
            return response.results;
        },
    });
    return localground.collections.Forms;
});