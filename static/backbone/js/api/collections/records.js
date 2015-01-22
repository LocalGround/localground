define([
    "underscore",
    "backbone-pageable",
    "models/record",
    "jquery",
    "collections/baseMixin"
], function (_, PageableCollection, Record, $, CollectionMixin) {
    "use strict";
    var Records = PageableCollection.extend({
        model: Record,
        columns: null,
        key: null,
        overlay_type: null,
        name: 'Records',
        query: '',
        url: null,
        initialize: function (recs, opts) {
            opts = opts || {};
            $.extend(this, opts);
            if (!this.url) {
                alert("The Records collection requires a url parameter upon initialization");
                return;
            }
            PageableCollection.prototype.initialize.apply(this, arguments);
        },
        state: {
            currentPage: 1,
            pageSize: 200,
            sortKey: 'id',
            order: 1
        },

        //  See documentation:
        //  https://github.com/backbone-paginator/backbone-pageable
        queryParams: {
            totalPages: null,
            totalRecords: null,
            sortKey: "ordering",
            pageSize: "page_size",
			currentPage: "page"
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
            options = options || {};
			options.data = options.data || {};
			$.extend(options.data, {
				page_size: this.state.pageSize,
				format: 'json',
				page: this.state.currentPage
			});
            //query
            if (this.query) {
                $.extend(options.data, {
					query: this.query
				});
            }
			//console.log(options.data);
            PageableCollection.__super__.fetch.apply(this, arguments);
        }
    });
    _.extend(Records.prototype, CollectionMixin);
    return Records;
});
