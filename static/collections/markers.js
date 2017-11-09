define(["models/marker", "collections/basePageable"],
function (Marker, BasePageable) {
    "use strict";
    /**
     * @class localground.collections.Markers
     */
    var Markers = BasePageable.extend({
        model: Marker,
        overlay_type: 'marker',
        name: 'Sites',
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

            this.query = "WHERE name like %" + term +
                        "% OR caption like %" + term +
                        "% OR owner like %" + term +
                        "% OR tags contains (" + term + ")";
            //this.query += " AND project_id = " + projectID;
            this.fetch({ reset: true });
        },

        clearSearch: function(projectID){
            this.query = ""; //WHERE project_id = " + projectID;
            this.fetch({ reset: true });
        }
    });
    return Markers;
});
