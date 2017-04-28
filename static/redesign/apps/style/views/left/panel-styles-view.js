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
                'change #font-size': 'updateFontSize'
            },

            initialize: function (opts) {
                _.extend(this, opts);
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
                        that.updateFontColor(hex);
                    }
                });
            },
            

            
            templateHelpers: function () {
                if (!this.model) {
                    return;
                }
                return {
                    json: JSON.stringify(this.model.toJSON(), null, 2),
                    currentType: this.model.get("panel_styles")[this.activeKey],
                    activeKey: this.activeKey
                    };
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
            // triggered from colorPicker
            updateFontColor: function (hex) {
                this.model.get("panel_styles")[this.activeKey].color = hex;
                $('#color-picker').css('color', '#' + hex);
                this.render();
            },  
            updateFontSize: function () {
                this.model.get("panel_styles")[this.activeKey].size = +this.$el.find("#font-size").val();
                this.render();
            }


        });
        return SelectSkinView;
    });

//This view needs to update the map.js model