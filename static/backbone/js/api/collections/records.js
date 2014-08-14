define([
		"external/backbone-pageable",
		"models/record"
	], function(PageableCollection, Record) {
    var Records = PageableCollection.extend({
        model: Record,
		columns: null,
		name: 'Records',
		query: '',
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
		state: {
			pageSize: 15,
			sortKey: 'id',
			order: 1
		},
	  
		//  See documentation:
		//	https://github.com/backbone-paginator/backbone-pageable
		queryParams: {
			totalPages: null,
			totalRecords: null,
			sortKey: "ordering",
			pageSize: "page_size"
		},
		
		parseState: function (resp, queryParams, state, options) {
			return {
				totalRecords: resp.count
			};
		},

		parseRecords: function (response, options) {
			return response.results;
		},
		
		fetch: function (options) {
			//query
			if (this.query) {
				options.data = options.data || {};
				$.extend(options.data, { query: this.query });
			};
			Records.__super__.fetch.apply(this, arguments);
		}
    });
    return Records;
});
