/**
 * Created by zmmachar on 12/17/14.
 */
define(["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the View datatype.
     * @class Project
     * @see <a href="http://localground.org/api/0/projects/">http://localground.org/api/0/projects/</a>
     */
    var View = Base.extend({
        urlRoot: "/api/0/views/"
    });
    return View;
});
