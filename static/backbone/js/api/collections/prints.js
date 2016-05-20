define(["models/print", "collections/base", "collections/basePageable"], function (Print, Base, BasePageable) {
    "use strict";
    /**
     * @class localground.collections.Prints
     */
    var Prints = BasePageable.extend({
        model: Print,
        name: 'Prints',
        url: '/api/0/prints/',
        // parse: function (response) {
        //     return response.results;
        // }
    });
    return Prints;
});
