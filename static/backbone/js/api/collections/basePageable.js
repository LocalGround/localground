define([
    "underscore",
    "backbone-pageable",
    "collections/baseMixin"
], function (_, BackbonePageableCollection, BaseMixin) {
    "use strict";
    var PageableCollection = BackbonePageableCollection.extend({

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
            return BackbonePageableCollection.prototype.fetch.call(this, options);
        }
    });
    return PageableCollection;
});
