
define([
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/edit-fonts-colors.html"
], function (_, Handlebars, Marionette, EditFontsColorsTemplate) {
    "use strict";
    var EditFontsColors = Marionette.ItemView.extend({
        template: Handlebars.compile(EditFontsColorsTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            this.secondaryModal = this.app.secondaryModal;
        },

        className: 'edit-fonts-colors',

        templateHelpers: function () {
            return {
                
            };
        },

        events: function () {
            return {
                'click #title-font': 'showTitleFonts',
                'click #paragraph-font': 'showParagraphFonts',
                'click #select-title-font div': 'updateTitleFont',
                'click #select-paragraph-font div': 'updateParagraphFont',
                'click .style-reset': 'resetStyles'
            }   
        },

        initialize: function (opts) {
            _.extend(this, opts);
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
            this.initColorPicker({
                className: 'title-font-color-picker',
                elementID: 'title-font-picker',
                color: this.model.get('panel_styles').title.color,
                updateFunction: this.updateTitleFontColor.bind(this)
            });
            this.initColorPicker({
                className: 'title-background-color-picker',
                elementID: 'title-background-picker',
                color: this.model.get('panel_styles').title.backgroundColor,
                updateFunction: this.updateTitleBackgroundColor.bind(this)
            });
            this.initColorPicker({
                className: 'paragraph-font-color-picker',
                elementID: 'paragraph-font-picker',
                color: this.model.get('panel_styles').paragraph.color,
                updateFunction: this.updateParagraphFontColor.bind(this)
            });
            this.initColorPicker({
                className: 'paragraph-background-color-picker',
                elementID: 'paragraph-background-picker',
                color: this.model.get('panel_styles').paragraph.backgroundColor,
                updateFunction: this.updateParagraphBackgroundColor.bind(this)
            });         
        },

        initColorPicker: function (opts) {
            $('.' + opts.className).remove();
            this.$el.find('#' + opts.elementID).ColorPicker({
               color: opts.color,
               onShow: function (colpkr) {
                   $(colpkr).fadeIn(200);
                   return false;
               },
               onHide: (colpkr) => {
                    opts.updateFunction(opts.color);
                   
                    $(colpkr).fadeOut(200);
                    return false;
               },
               onChange: (hsb, hex, rgb) => {
                   opts.color = '#' + hex;
               }
            });
            $(".colorpicker:last-child").addClass(opts.className);
        },

        showTitleFonts: function () {
            this.$el.find('#title-fonts-list').show();
        },

        showParagraphFonts: function () {
            this.$el.find('#paragraph-fonts-list').show();
        },

        hideFonts: function (e) {
            var $el = $(e.target);                
            if (!$el.hasClass('font-display')) {
                $(".font-options").hide();
            }
        },

        templateHelpers: function () {
            return {
                title: this.model.get("panel_styles").title,
                paragraph: this.model.get("panel_styles").paragraph
            };
        },
        
        
        updateTitleFont: function (event) {
            this.model.get("panel_styles").title.font = $(event.target).text();
            this.render();
        },

        updateParagraphFont: function (event) {
            this.model.get("panel_styles").paragraph.font = $(event.target).text();
            this.render();
        },
       
        // triggered from colorPicker
        updateTitleFontColor: function (hex) {
            this.model.get("panel_styles").title.color = hex;
            this.render();
        }, 

        // triggered from colorPicker
        updateTitleBackgroundColor: function (hex) {
            this.model.get("panel_styles").title.backgroundColor = hex;
            this.render();
        },

        // triggered from colorPicker
        updateParagraphFontColor: function (hex) {
            this.model.get("panel_styles").paragraph.color = hex;
            this.render();
        }, 

        // triggered from colorPicker
        updateParagraphBackgroundColor: function (hex) {
            this.model.get("panel_styles").paragraph.backgroundColor = hex;
            this.render();
        },
       
        saveFontsColors: function () {
            this.model.save(null, {
                success: () => {
                    this.app.vent.trigger('close-modal');
                }
            });
        }    
    });
    return EditFontsColors;
});
