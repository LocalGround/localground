define([
		"models/record"
	], function(Record) {
    var Records = Backbone.Collection.extend({
        model: Record,
		columns: null,
		name: 'Records',
        url: null,
		initialize: function (opts) {
			opts = opts || {};
			$.extend(this, opts);
			if (this.url == null) {
				alert("The Records collection requires a url parameter upon initialization");
				return;
			}
			Backbone.Model.prototype.initialize.apply(this, arguments);
		},
		parse : function(response) {
            return response.results;
        }
    });
    return Records;
});
