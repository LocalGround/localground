define(["jquery",
"marionette",
"handlebars",
"apps/style/views/symbols/native-symbols-view",
"apps/style/views/symbols/custom-symbols-view",
"text!../../templates/symbols/symbol-selection-layout.html"
],
function ($, Marionette, Handlebars, NativeSymbolsView, CustomSymbolsView, SymbolSelectionLayoutTemplate) {
    'use strict';
    var SymbolSelectionLayout = Marionette.LayoutView.extend({
        template: Handlebars.compile(SymbolSelectionLayoutTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            
            this.render();
           // this.listenTo(this.app.vent, 'edit-layer', this.createLayer);
        },

        onRender: function () {
            this.nsv = new NativeSymbolsView({
                app: this.app,
                model: this.model
            });
            this.csv = new CustomSymbolsView({
                app: this.app,
                model: this.model
            });
            this.nativeSymbols.show(this.nsv);
            this.customSymbols.show(this.csv);
            this.customSymbols.$el.hide();
            this.showNative();
        },

        events: {
            "click #native-tab" : "showNative",
            "click #custom-tab" : "showCustom"
            
        },

        showNative: function () {
            console.log("show native icons");
            this.$el.find('#native-tab').removeClass('inactive-tab');
            this.$el.find('#custom-tab').addClass('inactive-tab');
            this.customSymbols.$el.hide();
            this.nativeSymbols.$el.show();
        },

        showCustom: function () {
            this.$el.find('#custom-tab').removeClass('inactive-tab');
            this.$el.find('#native-tab').addClass('inactive-tab');
            this.customSymbols.$el.show();
            this.nativeSymbols.$el.hide();
            
        },

        regions: {
            nativeSymbols: "#native-symbols-region",
            customSymbols: "#custom-symbols-region"
        }

    });
    return SymbolSelectionLayout;
});
