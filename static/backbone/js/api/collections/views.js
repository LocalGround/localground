define(["models/view", "collections/base"], function (View, Base) {
    "use strict";
    /**
     * @class localground.collections.Views
     */
    var Views = Base.extend({
        model: View,
        name: 'Views',
        key: 'views',
        url: '/api/0/views/',
        parse: function (response) {
            return response.results;
        }
    });
    return Views;
});
