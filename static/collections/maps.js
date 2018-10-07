define(["models/map", "collections/basePageableWithProject"],
function (Map, BasePageableWithProject) {
    "use strict";
    var Maps = BasePageableWithProject.extend({
        model: Map,
        name: 'Maps',
        key: 'maps',
        url: '/api/0/maps/',
        
        initialize: function() {
            console.log('initialize maps collection');
            this.setComparator('name') 
        },
        setComparator: function(sortBy) {
            
            this.comparator = this.comparatorOptions()[sortBy];
        },


        comparatorOptions: function() {
            return {
                name: this.sortByName,
                created_by: this.sortByCreator,
                date_modified: this.sortByDateModified,
                access_level: this.sortByAccessLevel
            }
        },

        sortByName: function (a) {
            return a.get('name');
        },
        sortByCreator: function (a) {
            return a.get('owner');
        },
        sortByDateModified: function(mapA, mapB) {
            // sort newest to oldest
            if (mapA.get('time_stamp') > mapB.get('time_stamp')) return -1; // before
            if (mapB.get('time_stamp') > mapA.get('time_stamp')) return 1; // after
            return 0; // equal
        },
        sortByAccessLevel: function (a) {
            return a.get('metadata').accessLevel;
        }
    });
    return Maps;
});
