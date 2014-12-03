/**
 * Created by zmmachar on 10/15/14.
 */
define(["backbone",
        "underscore",
        "jquery",
        "text!" + templateDir + "/sidepanel/legendEntry.html"
    ],
    function (Backbone, _, $, LegendEntry) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var LegendItem = Backbone.View.extend({
            events: {
                'click .check-all': 'toggleShow',
                'click .zoom-to-extent': 'zoomToExtent'
            },
            initialize: function (opts) {
                $.extend(this, opts);
                this.app = opts.app;
                this.render();
            },
            render: function () {
                this.$el.html(_.template(LegendEntry, {
                    name: this.name,
                    items: this.children
                }));
            },
            toggleShow: function () {
                /*if (this.$el.find('.check-all').is(':checked')) {
                    this.children.each(function (child) {
                        child.checkItem();
                    });
                } else {
                    this.children.each(function (child) {
                        child.uncheckItem();
                    });
                }
                this.saveState();
                */
                this.app.vent.trigger("show-layer", {
                    legendItem: this
                });
                //alert("show");
                //e.preventDefault();
            },
            zoomToExtent: function (e) {
                //this.collection.trigger('zoom-to-extent');
                alert("zoom to extent");
                e.preventDefault();
            }
        });

        return LegendItem;

    });