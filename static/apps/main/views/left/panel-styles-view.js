define(["marionette",
        "handlebars",
        'color-picker-eyecon',
        "models/map",
        "apps/main/visibility-mixin",
        "text!../../templates/left/panel-styles.html"
    ],
    function (Marionette, Handlebars, colorPicker, Map, PanelVisibilityExtensions, PanelStylesTemplate) {
        'use strict';

        var SelectSkinView = Marionette.ItemView.extend(_.extend({}, PanelVisibilityExtensions, {
            stateKey: 'panel-styles',
            activeKey: "title",
            isShowing: false,
            template: Handlebars.compile(PanelStylesTemplate),

            events: function () {
                return _.extend(
                    {
                        'change #text-type': 'updateType',
                     //   'change #font': 'updateFont',
                        'change #fw': 'updateFontWeight',
                        'change #font-size': 'updateFontSize',
                        'click #font': 'showFonts',
                        'click .font-wrapper div': 'updateFont',
                        'click .legend-checkbox': 'updateLegend',
                        'click .style-reset': 'resetStyles'
                    },
                    PanelVisibilityExtensions.events
                );
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.restoreState();
                $('body').click(this.hideFonts);
            },

            resetStyles: function () {

                if (!confirm("Are you sure you want to reset map styles to their default?")) {
                    return;
                }

                var panelStyleDefaults = this.model.defaults().panel_styles;
                this.model.get("panel_styles").title.color = panelStyleDefaults.title.color;
                this.model.get("panel_styles").title.backgroundColor = panelStyleDefaults.title.backgroundColor;
                this.model.get("panel_styles").paragraph.color = panelStyleDefaults.paragraph.color;
                this.model.get("panel_styles").paragraph.backgroundColor = panelStyleDefaults.paragraph.backgroundColor;
                this.render();
            },
            
            onRender: function () {
                var that = this;
                var newHex,
                fontColor = this.model.get('panel_styles')[this.activeKey].color,
                backgroundColor = this.model.get('panel_styles')[this.activeKey].backgroundColor;
        
                $('panel-styles-color-picker-font').remove();
                that.$el.find('#font-color-picker').ColorPicker({
                    color: fontColor,
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        that.updateFontColor(fontColor);                 
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onChange: function (hsb, hex, rgb) {
                        fontColor = hex;
                    }
                });
                $(".colorpicker:last-child").addClass('panel-styles-color-picker-font');

                $('panel-styles-color-picker-background').remove();
                that.$el.find('#background-color-picker').ColorPicker({
                    color: backgroundColor,
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        that.updateBackgroundColor(backgroundColor);
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onChange: function (hsb, hex, rgb) {
                        backgroundColor = hex;
                    }
                });
                $(".colorpicker:last-child").addClass('panel-styles-color-picker-font');
            
                
            },

            showFonts: function () {
                this.$el.find('#font-div').show();
            },

            hideFonts: function (e) {
                var $el = $(e.target);                
                if (!$el.hasClass('font-options') && !$el.hasClass('font-dropdown-display') && !$el.hasClass('font-display')) {
                    $(".font-options").hide();
                }
            },

            templateHelpers: function () {
                var opts = PanelVisibilityExtensions.templateHelpers();
                if (!this.model) {
                    return {
                        isShowing: this.isShowing
                    };
                }
                return {
                    json: JSON.stringify(this.model.toJSON(), null, 2),
                    currentType: this.model.get("panel_styles")[this.activeKey],
                    activeKey: this.activeKey,
                    isShowing: this.isShowing,
                    displayLegend: this.model.get("panel_styles").display_legend
                };
            },

            updateLegend: function (event) {
                this.model.get("panel_styles").display_legend = $(event.target).is(':checked');
            },
           
            updateType: function () {
                this.activeKey = this.$el.find("#text-type").val();
                this.render();
            },
            updateFont: function (event) {
                this.model.get("panel_styles")[this.activeKey].font = $(event.target).text();
                this.render();
            },
            updateFontWeight: function () {
                this.model.get("panel_styles")[this.activeKey].fw = this.$el.find("#fw").val();
                this.render();
            },
            // triggered from colorPicker
            updateFontColor: function (hex) {
                this.model.get("panel_styles")[this.activeKey].color = hex;
                $('#font-color-picker').css('color', '#' + hex);
                this.render();
            }, 

            // triggered from colorPicker
            updateBackgroundColor: function (hex) {
                this.model.get("panel_styles")[this.activeKey].backgroundColor = hex;
                $('#background-color-picker').css('color', '#' + hex);
                this.render();
            },

            updateFontSize: function () {
                this.model.get("panel_styles")[this.activeKey].size = +this.$el.find("#font-size").val();
                this.render();
            }
        }));
        return SelectSkinView;
    });

//This view needs to update the map.js model