define(["marionette",
        "handlebars",
        "models/map",
        "text!../templates/panel-styles.html"
    ],
    function (Marionette, Handlebars, Map, PanelStylesTemplate) {
        'use strict';

        var SelectSkinView = Marionette.ItemView.extend({
            activeKey: "title",

            template: Handlebars.compile(PanelStylesTemplate),
            
            events: {
                'change #text-type': 'updateType',
                'change #font': 'updateFont',
                'change #fw': 'updateFontWeight',
                'change #font-color': 'updateFontColor',
                'change #font-size': 'updateFontSize'
            },

            initialize: function (opts) {
                this.app = opts.app;
                this.model = new Map(
                    { id: 1, name: "Flowers & Birds", project_id: 4 }
                    );
                console.log(this.model);
                this.listenTo(this.app.vent, 'change-map', this.setModel);

                // here is some fake data until the
                // /api/0/maps/ API Endpoint gets built:
                //  this.collection = Maps;
                console.log("panel styles initialized");
                //   console.log(this.app);
            },
            
            templateHelpers: function () {
                return {
                    json: JSON.stringify(this.model.toJSON(), null, 2),
                    currentType: this.model.get("panel_styles")[this.activeKey],
                    activeKey: this.activeKey,
                    font: this.model.get("panel_styles")[this.activeKey].font,
                    fontWeight: this.model.get("panel_styles")[this.activeKey].fw
                    };
            },
            setModel: function (model) {
                this.model = model;
                this.render();
                console.log(this.model);
            },
            updateType: function () {
                this.activeKey = this.$el.find("#text-type").val();
                this.render();
            },
            updateFont: function () {
                this.model.get("panel_styles")[this.activeKey].font = this.$el.find("#font").val();
                this.render();
            },
            updateFontWeight: function () {
                this.model.get("panel_styles")[this.activeKey].fw = this.$el.find("#fw").val();
                this.render();
            },
            updateFontColor: function () {
                //color picker functionality needed
            },
            updateFontSize: function () {
                this.model.get("panel_styles")[this.activeKey].size = this.$el.find("#font-size").val();
                this.render();
            },


        });
        return SelectSkinView;
    });

//This view needs to update the map.js model