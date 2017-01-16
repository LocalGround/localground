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

        doSearch: function (term, projectID, fields) {
            /*
             * NOTE
             *   - app.js is listening for the search-requested event
             *   - Please see localground/apps/site/api/tests/sql_parse_tests.py
             *     for samples of valid queries.
             */
            //var term = this.$el.find("#searchTerm").val(),
            if (!fields) return;

            this.query = "WHERE project = " + projectID + " AND ";
            //this.query += " AND 1 = -1";
            this.query += this.addFieldQuery(fields, term);

            /*
                        "% OR caption like %" + term +
                        "% OR attribution like %" + term +
                        "% OR owner like %" + term +
                        "% OR tags contains (" + term + ")";
            */
            //this.app.vent.trigger("search-requested", query);
            //e.preventDefault();
            console.log(this.query);
            this.fetch({ reset: true });
        },

        addFieldQuery: function(fields, term){
            console.log(fields);
            var recordQuery = "";
            for (var i = 0; i < fields.length; ++i){
                var type = fields.at(i).get("data_type").toLowerCase();
                var fieldName = fields.at(i).get("col_name").toLowerCase();
                //var fieldVal = fields.at(i).val(); // Let's try if that is viable (alternatively, I could do the "val" discovered from thumb.html)
                var fieldQuery = "";

                var conditionalSQL = i == 0? " AND " : " OR "
                switch (type) {
                    case "boolean":
                        //type = "checkbox";
                        if (typeof(term) === "boolean"){
                            if (term.toLowerCase() === "true"){
                                fieldQuery +=  " OR " + fieldName + " = 1";
                            } else {
                                fieldQuery +=  " OR " + fieldName + " = 0";
                            }
                            //fieldQuery +=  " OR " + fieldName + " = " + term;
                        }
                        //fieldQuery += " OR " + fieldName + " = " + term;
                        break;
                    case "integer":
                        //type = "numeric";
                        if (term === parseInt(term, 10)){
                            fieldQuery +=  " OR " + fieldName + " = " + term;
                        }
                        break;
                    default:
                        fieldQuery +=  " OR " + fieldName + " like '%" + term + "%'";
                }
                recordQuery += fieldQuery;
            }
            return recordQuery;
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
