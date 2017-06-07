define([
    "underscore",
    "backbone-pageable",
    "collections/baseMixin"
], function (_, BackbonePageable, BaseMixin) {
    "use strict";
    var PageableCollection = BackbonePageable.extend({
        getDataType: function () {
            return this.key;
        },
        fillColor: "#ed867d",
        size: 23,
        events: {
            'click #toolbar-search': 'doSearch',
            'click #toolbar-clear': 'clearSearch'
        },
        state: {
            currentPage: 1,
            pageSize: 150,
            sortKey: 'id',
            order: -1 // 1 for descending, -1 for ascending
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

        parseState: function (response, queryParams, state, options) {
            return {
                totalRecords: response.count
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

            this.query ="WHERE name like %" + term +
                        "% OR caption like %" + term +
                        "% OR attribution like %" + term +
                        "% OR owner like %" + term +
                        "% OR tags contains (" + term + ")";
            this.query += " AND project = " + projectID;
            this.fetch({ reset: true });
        },

        clearSearch: function(projectID){
            this.query = "WHERE project = " + projectID;
            this.fetch({ reset: true });
        }

    });
    _.extend(PageableCollection.prototype, BaseMixin);

    // and finally, need to override fetch from BaseMixin in a way that calls the parent class
    _.extend(PageableCollection.prototype, {
        fetch: function (options) {
            //override fetch and append query parameters:
            if (this.query) {
                // apply some additional options to the fetch:
                options = options || {};
                options.data = options.data || {};
                options.data = { query: this.query };
            }
            return BackbonePageable.prototype.fetch.call(this, options);
        }
    });
    return PageableCollection;
});
