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
        key: 'form_?',
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
            if (!this.key) {
                alert("The Records collection requires a key parameter upon initialization");
                return;
            }
            PageableCollection.prototype.initialize.apply(this, arguments);
        },
        state: {
            currentPage: 1,
            pageSize: 200,
            sortKey: 'id',
            order: -1 // -1 for ascending, 1 for descending
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

        doSearch: function (term, projectID, fields) {
            /*
             * NOTE
             *   - app.js is listening for the search-requested event
             *   - Please see localground/apps/site/api/tests/sql_parse_tests.py
             *     for samples of valid queries.
             */
            if (!fields) return;

            this.query = "WHERE " + this.addFieldQuery(fields, term);
            this.query += " AND project = " + projectID
            this.fetch({ reset: true });
        },

        addFieldQuery: function(fields, term){
            var recordQuery = "";
            var fieldQueries = [];

            for (var i = 0; i < fields.length; ++i){
                var type = fields.at(i).get("data_type").toLowerCase();
                var fieldName = fields.at(i).get("col_name").toLowerCase();
                var fieldQuery = "";

                var conditionalSQL = i == 0? " AND " : " OR ";

                switch (type) {
                    case "boolean":
                        if (term.toLowerCase() === "true"){
                            fieldQueries.push(fieldName + " = 1");
                        } else if (term.toLowerCase() === "false") {
                            fieldQueries.push(fieldName + " = 0");
                        }
                        break;
                    case "integer":
                        // Check if it is a number
                        if (!isNaN(term)){
                            fieldQueries.push(fieldName + " = " + term);
                        }
                        break;
                    default:
                        fieldQueries.push(fieldName + " like '%" + term + "%'");
                }
            }
            return fieldQueries.join(" OR ");
        },

        clearSearch: function(projectID){
            this.query = "WHERE project = " + projectID;
            this.fetch({ reset: true });
        }
    });
    _.extend(Records.prototype, CollectionMixin);
    _.extend(Records.prototype, {
        fetch: function (options) {
            options = options || {};
			options.data = options.data || {};
			$.extend(options.data, {
				page_size: this.state.pageSize,
				format: 'json',
				page: this.state.currentPage,
                ordering: this.state.sortKey,
                order: (this.state.order === -1) ? "asc" : "desc"
			});
            if (this.query) {
                $.extend(options.data, {
					query: this.query
				});
            }
            PageableCollection.__super__.fetch.apply(this, arguments);
        }
    });
    return Records;
});
