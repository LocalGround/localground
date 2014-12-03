define(["marionette",
        "underscore",
        "jquery",
        "views/maps/sidepanel/legendItem",
        "text!" + templateDir + "/sidepanel/legendPanelHeader.html"
    ],
    function (Marionette, _, $, LegendItem, legendPanelHeader) {
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
            entries: [
                {
                    id: 1,
                    name: "Worms",
                    children: [
                        {
                            title: "Places with at least 1 worm",
                            color: "#7075FF",
                            rule: "worms > 0"
                        },
                        {
                            title: "Places with no worms",
                            color: "#F011D9",
                            rule: "worms = 0"
                        }
                    ]
                },
                {
                    id: 2,
                    name: "Soil Moisture",
                    children: [
                        {
                            title: "Places with moist soil",
                            color: "#428BCA",
                            rule: "moisture = 'moist'"
                        },
                        {
                            title: "Places with dry soil",
                            color: "#b7f081",
                            rule: "moisture = 'dry'"
                        }
                    ]
                },
                {
                    id: 3,
                    name: "Percolation Time",
                    children: [
                        {
                            title: "Places with a fast percolation time",
                            color: "#a2e6ef",
                            rule: "percolation <= 30"
                        },
                        {
                            title: "Places with a medium percolation time",
                            color: "#19b8ca",
                            rule: "percolation > 30 and percolation <= 200"
                        },
                        {
                            title: "Places with a slow percolation time",
                            color: "#0e727e",
                            rule: "percolation > 200"
                        }
                    ]
                },
                {
                    id: 4,
                    name: "Pitfall Count",
                    children: [
                        {
                            title: "Places with less than 10 invertebrates",
                            color: "#5cee1e",
                            rule: "pitfall < 10"
                        },
                        {
                            title: "Places with 10 or more invertebrates",
                            color: "#3b9914",
                            rule: "pitfall >= 10"
                        }
                    ]
                }
            ],
            regions: {
                legend: "#legend-manager"
            },
            /**
             * Initializes the dataPanel
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                opts.app.vent.on("new-collection-created", this.applyToCollection.bind(this));
                opts.app.vent.on("adjust-layout", this.resize.bind(this));
            },

            addLegendEntries: function () {
                var that = this,
                    selector;
                $.each(this.entries, function () {
                    selector = "legend_" + this.id;
                    console.log(that.$el);
                    that.$el.find('#legend-manager').append($('<div id="' + selector + '"></div>'));
                    that.addRegion(selector, '#' + selector);
                    that[selector].show(new LegendItem(this));
                });
            },

            onShow: function () {
                this.addLegendEntries();
                this.resize();
            },

            applyToCollection: function (opts) {
                //console.log(opts.collection);
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
