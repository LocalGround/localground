define(["jquery", "backbone",
        "models/form", "collections/basePageableWithProject"],
    function ($, Backbone, Form, BasePageableWithProject) {
    "use strict";
    var Forms = BasePageableWithProject.extend({
        model: Form,
        name: 'Forms',
        key: 'forms',
        url: '/api/0/datasets/',
        parse: function (response) {
            return response.results;
        },
        initialize: function() {
            this.setComparator('name') 
        },
        setComparator: function(sortBy) {
            
            this.comparator = this.comparatorOptions()[sortBy];
        },

        comparatorOptions: function() {
            return {
                name: this.sortByName,
                record_count: this.sortByRecordCount,
                date_modified: this.sortByDateModified
            }
        },
 
        sortByName: function (a) {
            return a.get('name');
        },
        sortByRecordCount: function (a) {
            return -a.get('models').length;
        },
        sortByDateModified: function(a) {
            // don't yet have timestamps for datasets, so just do name for now.
            return a.get('name');
            //  // sort newest to oldest
            //  if (datasetA.get('time_stamp') > datasetB.get('time_stamp')) return -1; // before
            //  if (datasetB.get('time_stamp') > datasetA.get('time_stamp')) return 1; // after
            //  return 0; // equal
        }
    });
    return Forms;
});
