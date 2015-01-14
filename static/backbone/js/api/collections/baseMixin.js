define(["lib/sqlParser"], function (SqlParser) {
    "use strict";
    return {
        applyFilter: function (sql) {
            var sqlParser = new SqlParser(sql),
                count = 0,
                hidden = false;
            this.each(function (item) {
                if (sqlParser.checkModel(item)) {
                    item.set("isVisible", true);
                } else {
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
        },
        getVisibleModels: function () {
            var models = [];
            this.each(function (item) {
                if (item.get("isVisible")) {
                    models.push(item);
                }
            });
            return models;
        }
    };
});
