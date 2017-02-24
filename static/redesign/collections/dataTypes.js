define(["backbone", "models/dataType"],
    function (Backbone, DataType) {
        "use strict";
        var DataTypes = Backbone.Collection.extend({
            model: DataType,
            name: 'Data Types',
            url: '/api/0/data-types/',
            parse: function (response) {
                return response.results;
            }
        });
        return DataTypes;
    });