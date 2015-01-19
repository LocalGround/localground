/**
 * Created by zmmachar on 12/17/14.
 */
define(["underscore", "models/base"], function (_, Base) {
    "use strict";
    var View = Base.extend({
        urlRoot: "/api/0/views/"
    });
    return View;
});
