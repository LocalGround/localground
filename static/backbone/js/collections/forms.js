define(["jquery", "lib/external/backbone-min", "models/form"], function($, Backbone, Form) {
    var Forms = Backbone.Collection.extend({
        model: Form,
		name: 'Forms',
        url: '/api/0/forms/',
		parse : function(response) {
            return response.results;
        },
    });
    return Forms;
});