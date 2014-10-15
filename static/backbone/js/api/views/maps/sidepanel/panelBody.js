/**
 * Created by zmmachar on 9/30/14.
 */
define(["marionette",
        "underscore",
        "views/maps/sidepanel/projectTags",
        "text!" + templateDir + "/sidepanel/panelBody.html"
    ],
    function (Marionette, _, ProjectTags, panelTemplate) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var PanelBody = Marionette.LayoutView.extend({
            /**
             * @lends localground.maps.views.DataPanel#
             */
            events: {
            },
            regions: {
                projectTags: ".project-tags"
            },
            template: _.template(panelTemplate),

            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
            },

            onShow: function () {
                this.projectTags.show(new ProjectTags(this.opts));
            }
             /**
             * Creates a new data-type listing (photos, audio, etc) in the
             * right-hand panel
             */
            //TODO: move to panelBody view
            /*createItemsView: function (data) {
                //this.addProjectTag();
                var $container = $("<div></div>");
                this.$el.find('.pane-body').append($container);

                this.sb.loadSubmodule(
                        "items-" + data.collection.key,
                    localground.maps.views.Items,
                    {
                        collection: data.collection,
                        el: $container
                    }
                );
            },*/

        });
        return PanelBody;
    });
