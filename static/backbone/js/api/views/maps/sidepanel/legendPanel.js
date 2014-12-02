define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/sidepanel/legendPanelHeader.html",
        "views/maps/sidepanel/projectsMenu",
        "views/maps/sidepanel/projectTags",
        "views/maps/sidepanel/itemListManager",
        "views/maps/sidepanel/filter"
    ],
    function (Marionette, _, $, legendPanelHeader) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var LegendPanel = Marionette.LayoutView.extend({
            /**
             * @lends localground.maps.views.DataPanel#
             */
            template: function () {
                return _.template(legendPanelHeader);
            },

            events: {
                'click #mode_toggle': 'toggleEditMode'
            },
            regions: {},
            /**
             * Initializes the dataPanel
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                //this.projectTags.show(new ProjectTags(app, opts));
                //this.panelBody.show(new PanelBody(app, opts));
                // Listen for the "new_collection" event. On each new
                // collection event add a new ItemsView to the DataPanel.
                //app.vent.on("new-collection-created", this.createItemsView.bind(this));
                opts.app.vent.on("adjust-layout", this.resize.bind(this));
            },

            onShow: function () {

            },

            destroy: function () {
                this.remove();
            },

            resize: function () {
                this.$el.find('.pane-body').height($('body').height() - 140);
            }
        });
        return LegendPanel;
    });
