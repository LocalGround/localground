define(["lib/sqlParser","underscore"], function (SqlParser, _) {
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
        },
        createServerQuery: function(parameters){
          var query = "?query=WHERE+";
          _.each(parameters, function(parameter){
            // console.log(parameter);
            query += parameter["name"] + "+LIKE+%27%25"+ parameter["value"] + "%25%27";
          });

          return query;
        }
    };
});
