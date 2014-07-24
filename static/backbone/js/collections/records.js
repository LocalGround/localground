define([
		"models/record"
	], function(Record) {
    var Records = Backbone.Collection.extend({
        model: Record,
		columns: null,
		name: 'Records',
        url: "/api/0/forms/9/data/",
		initialize: function (opts) {
			Backbone.Model.prototype.initialize.apply(this, arguments);
		},
		parse : function(response) {
            return response.results;
        }
    });
    return Records;
});
