/**
 * Created by zmmachar on 12/17/14.
 */
define(["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the View datatype.
     * @class Project
     * @see <a href="//localground.org/api/0/projects/">//localground.org/api/0/projects/</a>
     */
    var Snapshot = Base.extend({
        urlRoot: "/api/0/snapshots/"
    });
    return Snapshot;
});
