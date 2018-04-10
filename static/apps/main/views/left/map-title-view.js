define(["marionette",
        "handlebars",
        "text!../../templates/left/map-title.html",
    ],
    function (Marionette, Handlebars, MapTemplate) {
        'use strict';

        var MapTitleView = Marionette.ItemView.extend({
            template: Handlebars.compile(MapTemplate),
            initialize: function (opts) {
                var that = this;
                _.extend(this, opts);
                this.modal = this.app.modal;
            },
            events: {
                'click': 'showEditModal'
            },
            showEditModal: function (e) {
                alert('show edit modal');
                if (e) { e.preventDefault(); }
            }
        });
        return MapTitleView;
    });
