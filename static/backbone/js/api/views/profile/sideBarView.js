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
                    this.options.view = "photos";
                    this.app.vent.trigger("show-edit-view",this.options);
            },
            loadScanView: function (e) {
                    this.options.view = "scan";
                    this.app.vent.trigger("show-edit-view",this.options);
            },
            loadAudioView: function (e) {
                    this.options.view = "audio";
                    this.app.vent.trigger("show-edit-view",this.options);
            }

        });
        return SideBarView;
    });
