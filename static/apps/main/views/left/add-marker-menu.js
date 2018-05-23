define(["marionette",
        "handlebars",
        "text!../../templates/left/add-marker-menu.html"
    ],
    function (Marionette, Handlebars, AddMarkerTemplate) {
        'use strict';

        var AddMarkerMenu =  Marionette.ItemView.extend({
            events: {
                'click #select-point': 'initAddPoint',
                'click #select-polygon': 'initAddPolygon',
                'click #select-polyline': 'initAddPolyline',
            },

            initialize: function (opts) {
                _.extend(this, opts);
            },

            template: Handlebars.compile(AddMarkerTemplate),

            notifyDrawingManager: function (e, mode) {
                this.app.vent.trigger('hide-popover');
                this.app.vent.trigger(mode, this.parent.cid, e);
                if (e) {
                    e.preventDefault();
                }
            },

            initAddPoint: function (e) {
                this.notifyDrawingManager(e, 'add-point');
            },

            initAddPolygon: function(e) {
                this.notifyDrawingManager(e, 'add-polygon');
            },

            initAddPolyline: function(e) {
                this.notifyDrawingManager(e, 'add-polyline');
            },

            initAddRectangle: function () {
                $('body').css({ cursor: 'crosshair' });
                this.notifyDrawingManager(e, 'add-rectangle');
            }
        });
        return AddMarkerMenu;
    });
