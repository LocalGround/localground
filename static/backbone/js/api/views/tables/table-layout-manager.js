define([
    "jquery",
    "backbone",
    "views/tables/table-utilities-mixin",
    "colResizable"
], function ($, Backbone, Utilities) {
    "use strict";
    var TableLayoutManager = Backbone.View.extend({
        datagrid: null,
        $el: null,
        initialize: function (opts) {
            $.extend(this, opts);
            this.ensureRequiredParam("datagrid");
            this.$el = this.datagrid.$el;
            this.initEventListeners();
        },
        initEventListeners: function () {
            this.listenTo(this.datagrid.records, "backgrid:refresh", this.initLayout);
            this.listenTo(this.datagrid.columns, "column-added", this.initLayout);
            this.listenTo(this.datagrid.columns, "schema-updated", this.initLayout);
            this.listenTo(this.datagrid.columns, "change:display_width", this.initLayout);
        },
        initLayout: function () {
            //console.log('initializing layout');
            var that = this;
            this.$el.find('table').addClass('table-bordered');
            this.resize();
            this.makeColumnsResizable();

            $(window).off('resize');
            $(window).on('resize', function () {
                that.resize();
            });
        },

        makeColumnsResizable: function () {
            var totalWidth = 0,
                w = null,
                columnWidths = [];
            this.datagrid.columns.each(function (model) {
                w = model.get("display_width");
                columnWidths.push(w);
                totalWidth += w;
            });
            this.$el.find('table, tbody, thead').css({ 'width': totalWidth });
            this.$el.find('table').colResizable({ disable: true }); //a hack to run garbage collection for resizable table
            this.$el.find('table').colResizable({
                disable: false,
                columnWidths: columnWidths,
                onResize: this.saveResizeToDatabase.bind(this) //callback that saves new column widths to the database:
            });
        },

        saveResizeToDatabase: function (diffs) {
            var field, that = this;
            _.each(diffs, function (diff) {
                field = that.datagrid.columns.at(diff.idx);
                if (!field.get("isAdmin")) { //not an admin field
                    field.save({display_width: diff.width }, {patch: true});
                } else {
                    // don't commit to the database if it's an admin field
                    // because there's no such field:
                    field.set("display_width", diff.width);
                }
            });
        },

        resize: function () {
            var h = $('body').height() - $("#navbar").height() -
                    $(".container-footer").height() - 2;
            this.$el.height(h);
            this.$el.find('tbody').height(h - $('thead').height());
        }
    });
    _.extend(TableLayoutManager.prototype, Utilities);
    return TableLayoutManager;
});