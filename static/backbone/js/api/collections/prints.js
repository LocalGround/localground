define(["models/print", "collections/base"], function (Print, Base) {
    "use strict";
    /**
     * @class localground.collections.Prints
     */
    var Prints = Base.extend({
        model: Print,
        name: 'Prints',
        url: '/api/0/prints/',
        parse: function (response) {
            return response.results;
        }
    });
    return Prints;
});
