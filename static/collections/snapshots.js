define(["models/snapshot", "collections/base"], function (Snapshot, Base) {
    "use strict";
    /**
     * @class localground.collections.Views
     */
    var Snapshots = Base.extend({
        model: Snapshot,
        name: 'Snapshots',
        key: 'snapshots',
        url: '/api/0/snapshots/',
        parse: function (response) {
            return response.results;
        }
    });
    return Snapshots;
});
