define(["jquery", "backbone", "colResizable"], function ($, Backbone) {
    "use strict";
    var TableLayoutManager = Backbone.View.extend({
        datagrid: null,
        $el: null,
        initialize: function (opts) {
            $.extend(this, opts);
            this.$el = this.datagrid.$el;
            this.listenTo(this.datagrid.records, "backgrid:refresh", this.initLayout);
            this.listenTo(this.datagrid.columns, "column-added", this.initLayout);
            this.listenTo(this.datagrid.columns, "remove", this.initLayout);
            this.listenTo(this.datagrid.records, "backgrid:sorted", this.initLayout);
            this.listenTo(this.datagrid.columns, "change", this.changeddddd);
        },
        changeddddd: function () {
            console.log('changed');
            this.initLayout();
        },
        initLayout: function () {
            console.log('initializing layout');
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
            var totalWidth = 0, // (this.columns.length * this.columnWidth) + "px",
                w = null,
                columnWidths = [],
                that = this,
                field = null;
            this.datagrid.columns.each(function (model) {
                w = model.get("width");
                columnWidths.push(w);
                totalWidth += w;
            });
            this.$el.find('table, tbody, thead').css({ 'width': totalWidth });
            this.$el.find('table').colResizable({ disable: true }); //a hack to run garbage collection for resizable table
            this.$el.find('table').colResizable({
                disable: false,
                columnWidths: columnWidths,
                onResize: function (diffs) {
                    //callback that saves new column widths to the database:
                    _.each(diffs, function (diff) {
                        field = that.datagrid.columns.at(diff.idx);
                        field.save({display_width: diff.width }, {patch: true});
                    });
                }
            });
        },

        resize: function () {
            var h = $('body').height() - $("#navbar").height() -
                    $(".container-footer").height() - 2;
            this.$el.height(h);
            this.$el.find('tbody').height(h - $('thead').height());
        },

        destroy: function () {
            this.undelegateEvents();
            //this.remove();
            //this.$el = null;
        }
    });
    return TableLayoutManager;
});