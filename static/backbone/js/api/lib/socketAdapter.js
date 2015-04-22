/**
 * Created by zmmachar on 3/11/15.
 */
define(["marionette",
        "socketio"
    ], function (Marionette, io) {
    "use strict";

    var SocketAdapter = function (app) {
        this.app = app;
        //Register io listeners to hook into event aggregator

    };

    return SocketAdapter;


});
