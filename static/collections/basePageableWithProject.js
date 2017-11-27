define([
    "underscore",
    "collections/basePageable"
], function (_, BasePageable) {
    "use strict";
    var BasePageableWithProject = BasePageable.extend({
        initialize: function (recs, opts) {
            opts = opts || {};
            _.extend(this, opts);
            if (!this.projectID) {
                console.error("projectID is required: " + this.key);
                return;
            }
            BasePageable.prototype.initialize.apply(this, arguments);
        }
    });
    return BasePageableWithProject;
});
