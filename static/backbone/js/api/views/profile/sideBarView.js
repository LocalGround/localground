define(["underscore",
        "marionette",
        "text!../../../templates/profile/sideBar.html"
    ],
    function (_, Marionette, SideBarTemplate) {
        'use strict';
        var SideBarView = Marionette.ItemView.extend({
            events: {
                "click #photos": "loadPhotosView",
                "click #scan": "loadScanView",
                "click #audio": "loadAudioView"
            },
            initialize: function (opts) {
                _.extend(this, opts);
                // additional initialization logic goes here...
                this.options = opts;
            },
            template: function () {
                return _.template(SideBarTemplate);
            },
            loadPhotosView: function (e) {
                this.app.objectType = "photos";
                this.app.vent.trigger("show-list-view");
                e.preventDefault();
            },
            loadAudioView: function (e) {
                this.app.objectType = "audio";
                this.app.vent.trigger("show-list-view");
                e.preventDefault();
            },
            loadScanView: function (e) {
                this.app.objectType = "map-images";
                this.app.vent.trigger("show-list-view");
                e.preventDefault();
            }

        });
        return SideBarView;
    });
