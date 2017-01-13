define(["models/marker", "collections/basePageable"],
function (Marker, BasePageable) {
    "use strict";
    /**
     * @class localground.collections.Markers
     */
    var Markers = BasePageable.extend({
        model: Marker,
        name: 'Markers',
        key: 'markers',
        url: '/api/0/markers/',
        parse: function (response) {
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
        }
    });
    return Markers;
});
