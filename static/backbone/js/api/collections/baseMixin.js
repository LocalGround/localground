define([], function () {
    "use strict";
    return {
        applyFilter: function (key, val) {
            var count = 0,
                hidden = false;
            this.each(function (item) {
                if (item.get(key) !== val) {
                    //console.log(key, val);
                    item.set("isVisible", false);
                    ++count;
                }
            });
            if (count == this.models.length) {
                hidden = true;
            }
            this.trigger("filtered", { doNotRender: hidden });
        },
        clearFilter: function () {
            this.each(function (item) {
                item.set("isVisible", true);
            });
            this.trigger("filtered", { doNotRender: false });
        }
    };
});
