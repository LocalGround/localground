define(["models/map", "collections/basePageableWithProject"],
function (Map, BasePageableWithProject) {
    "use strict";
    var Maps = BasePageableWithProject.extend({
        model: Map,
        name: 'Maps',
        key: 'maps',
        url: '/api/0/maps/',
        // comparator: function (a) {
        //     console.log('sorting');
        //     return a.get('name');
        // },
        initialize: function() {
           this.setComparator('name') 
        },
        setComparator: function(sortBy) {
            switch(sortBy) {
                case 'name':
                    this.comparator = this.sortByName;
                    break;
                case 'created_by':
                    this.comparator = this.sortByCreator;
                    break;
                case 'date_modified':
                    this.comparator = this.sortByDateModified;
                    break;
                case 'access_level':
                    this.comparator = this.sortByAccessLevel;
                    break;
                default:
                    this.comparator = this.compareByName;
            }
        },
        sortByName: function (a) {
            return a.get('name');
        },
        sortByCreator: function (a) {
            return a.get('owner');
        },
        sortByDateModified: function(mapA, mapB) {
            if (mapA.get('time_stamp') > mapB.get('time_stamp')) return -1; // before
            if (mapB.get('time_stamp') > mapA.get('time_stamp')) return 1; // after
            return 0; // equal
        },
        sortByAccessLevel: function (a) {
            return a.get('metadata').accessLevel;
        },
        

    });
    return Maps;
});
