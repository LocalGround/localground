define(["models/base", "underscore"], function (Base, _) {
    'use strict';
    var BaseItem = Base.extend({
        initialize: function (data, opts) {
            _.extend(this, opts);
            Base.prototype.initialize.call(this);
            this.projectID = this.projectID || this.get('project_id');
            if (!this.projectID ) {
                console.error("projectID is required");
                return;
            }
        },
        url: function () {
            var url = Base.prototype.url.call(this);
            if (url.indexOf('project_id') === -1) {
                if (url.indexOf('?') === -1) {
                    url += '?project_id=' + this.projectID;
                } else {
                    url += '&project_id=' + this.projectID;
                }
            }
            return url;
        }
    });
    return BaseItem;
});
