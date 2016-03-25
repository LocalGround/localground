define([
    "underscore",
    "backbone-pageable",
    "jquery",
    "collections/base"
], function (_, PageableCollection, $, Base) {
  "use strict";
  var PageableCollection = PageableCollection.extend({

    state: {
        currentPage: 1,
        pageSize: 2,
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

  });
  _.extend(PageableCollection.prototype, Base);
  return PageableCollection;
});
