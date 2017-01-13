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
        key: 'records',
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

        doSearch: function (term, projectID) {
            /*
             * NOTE
             *   - app.js is listening for the search-requested event
             *   - Please see localground/apps/site/api/tests/sql_parse_tests.py
             *     for samples of valid queries.
             */
            //var term = this.$el.find("#searchTerm").val(),
            this.query = "WHERE project = " + projectID;
            this.query += " AND name like %" + term +
                        "% OR caption like %" + term +
                        "% OR attribution like %" + term +
                        "% OR owner like %" + term +
                        "% OR tags contains (" + term + ")";
            //this.app.vent.trigger("search-requested", query);
            //e.preventDefault();
            //console.log(this.query);
            this.fetch({ reset: true });
        },

        clearSearch: function(){
            this.query = null;
            //console.log(this.query);
            this.fetch({ reset: true });
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
