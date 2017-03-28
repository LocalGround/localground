define(["marionette",
        "handlebars",
        'color-picker-eyecon',
        "models/map",
        "text!../../templates/left/panel-styles.html"
    ],
    function (Marionette, Handlebars, colorPicker, Map, PanelStylesTemplate) {
        'use strict';

        var SelectSkinView = Marionette.ItemView.extend({
            activeKey: "title",

            template: Handlebars.compile(PanelStylesTemplate),
            
            events: {
                'change #text-type': 'updateType',
                'change #font': 'updateFont',
                'change #fw': 'updateFontWeight',
                'change #color-picker': 'updateFontColor',
                'change #font-size': 'updateFontSize',
                'click #style-save' : "saveStyles" 
            },

            initialize: function (opts) {
                _.extend(this, opts);
                console.log(this);
                console.log(this.model);
                console.log(opts);
              /*  this.app = opts.app;
              //  this.model = new Map(
              //      { id: 1, name: "Flowers & Birds", project_id: 4 }
              //      );*/
              //  console.log(this.model);
              //  this.listenTo(this.app.vent, 'change-map', this.setModel);

                // here is some fake data until the
                // /api/0/maps/ API Endpoint gets built:
                //  this.collection = Maps;
                console.log("panel styles initialized");
                console.log(this.collection);
                
            },
            
            onRender: function () {
                var that = this;
                this.$el.find('#color-picker').ColorPicker({
            
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onChange: function (hsb, hex, rgb) {
                        that.model.get("panel_styles")[that.activeKey].color = hex;
                        $('#color-picker').css('color', '#' + hex);
                        that.render();
                    }
                });
            },
            

            
            templateHelpers: function () {
                if (!this.model) {
                    return;
                }
                console.log(this.model.get("panel_styles")[this.activeKey]);
                return {
                    json: JSON.stringify(this.model.toJSON(), null, 2),
                    currentType: this.model.get("panel_styles")[this.activeKey],
                    activeKey: this.activeKey,
                   // font: this.model.get("panel_styles")[this.activeKey].font,
                   // fontWeight: this.model.get("panel_styles")[this.activeKey].fw
                    };
            },
            /*
            setModel: function (model) {
                console.log(model);
                this.model = model;
                this.render();
                console.log(this.model);
            },*/
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
                this.model.get("panel_styles")[this.activeKey].color = this.$el.find("#color-picker").css("color");
                console.log(this.$el.find("#color-picker").css("color"));
                this.render();
            },
            updateFontSize: function () {
                this.model.get("panel_styles")[this.activeKey].size = +this.$el.find("#font-size").val();
                this.render();
            },
            
            saveStyles: function() {
                this.model.set("zoom", this.app.getZoom());
                this.model.set("center", this.app.getCenter());
                
                this.model.set("basemap", this.app.getMapTypeId());
                
                console.log(JSON.stringify(this.model.toJSON(), null, 2));
               // this.model.set("basemap", 1);
                this.model.save({
                    error: function(){
                        console.log('error');
                    },
                        success: function(){
                            console.log('success');
                    }
                });
            }


        });
        return SelectSkinView;
    });

//This view needs to update the map.js model