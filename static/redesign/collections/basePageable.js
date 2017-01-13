define([
    "underscore",
    "backbone-pageable",
    "collections/baseMixin"
], function (_, BackbonePageableCollection, BaseMixin) {
    "use strict";
    var PageableCollection = BackbonePageableCollection.extend({

        events: {
            'click #toolbar-search': 'doSearch',
            'click #toolbar-clear': 'clearSearch'
        },
        state: {
            currentPage: 1,
            pageSize: 50,
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
            //var term = this.$el.find("#searchTerm").val(),
            this.query = "WHERE project = " + projectID;
            this.query += " AND name like %" + term +
                        "% OR caption like %" + term +
                        "% OR attribution like %" + term +
                        "% OR owner like %" + term +
                        "% OR tags contains (" + term + ")";
            //this.app.vent.trigger("search-requested", query);
            //e.preventDefault();
            console.log(this.query);
            this.fetch({ reset: true });
        },

        clearSearch: function(){
            this.query = null;
            console.log(this.query);
        }

    });
    _.extend(PageableCollection.prototype, BaseMixin);

    // and finally, need to override fetch from BaseMixin in a way that calls the parent class
    _.extend(PageableCollection.prototype, {
        fetch: function (options) {
            //console.log(this.query);
            //override fetch and append query parameters:
            if (this.query) {
                // apply some additional options to the fetch:
                options = options || {};
                options.data = options.data || {};
                options.data = { query: this.query };
            }
            return BackbonePageableCollection.prototype.fetch.call(this, options);
        }
    });
    return PageableCollection;
});
