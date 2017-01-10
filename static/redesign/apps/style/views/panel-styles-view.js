define(["marionette",
        "handlebars",
        "models/map",
        "text!../templates/panel-styles.html"
    ],
    function (Marionette, Handlebars, Map, PanelStylesTemplate) {
        'use strict';

        var SelectSkinView = Marionette.ItemView.extend({
            activeIndex: 0,

            template: Handlebars.compile(PanelStylesTemplate),
            
            events: {
                'click #style-save': 'updateStyles' 
            },

            initialize: function (opts) {
                this.app = opts.app;
                this.model = new Map(
                    { id: 1, name: "Flowers & Birds", project_id: 4 }
                    );
                console.log("ok");
                console.log(this.model);
                this.listenTo(this.app.vent, 'change-map', this.setModel);

                // here is some fake data until the
                // /api/0/maps/ API Endpoint gets built:
                //  this.collection = Maps;
                console.log("panel styles initialized");
                //   console.log(this.app);
                console.log(Map);
            },
            
            templateHelpers: function () {
                return {
                    json: JSON.stringify(this.model.toJSON(), null, 2),
                    currentType: this.model.get("panel_styles")[this.activeIndex]
                    };
            },
            setModel: function (model) {
                this.model = model;
                this.render();
                console.log(this.model);
            },
            updateStyles: function () {
                //this.$el.find()
                var all = this.model.get("panel_styles");
                this.model.set("panel_styles", s)
            //    var type = $("#type").val();
            //    var font = $("#font").val();
            //    var fontweight = $("#fw").val();
            
                this.model.get("panel_styles").fw = fontweight;
                this.model.attributes.panel_styles[0].fw = $("#font").val();

            }

        });
        return SelectSkinView;
    });

//This view needs to update the map.js model