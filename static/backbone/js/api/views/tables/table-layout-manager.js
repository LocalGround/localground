define(["jquery", "backbone"], function ($, Backbone) {
    "use strict";
    var TableLayoutManager = Backbone.View.extend({
        datagrid: null,
        $el: null,
        initialize: function (opts) {
            $.extend(this, opts);
            this.$el = this.datagrid.$el;
            this.listenTo(this.datagrid, "row:added", this.initLayout);
            //this.listenTo(this.datagrid.records, "reset", this.initLayout);
        },

        initLayout: function () {
            var that = this;
            this.$el.find('table').addClass('table-bordered');
            this.resize();
            this.makeColumnsResizable();

            $(window).off('resize');
            $(window).on('resize', function () {
                that.grid.resize();
            });
        },

        makeColumnsResizable: function () {
            var totalWidth = 0, // (this.columns.length * this.columnWidth) + "px",
                //index = 0,
                w = null,
                columnWidths = [];
            this.datagrid.columns.each(function (model) {
                //$td = $(">tbody>tr:first>td:nth-child(" + (index) + ")");
                w = model.get("width");
                //$td.width(w);
                columnWidths.push(w);
                //console.log(w);
                totalWidth += w;
                //++index;
            });
            //console.log(this.columns.length);
            this.$el.find('table, tbody, thead').css({ 'width': totalWidth });
            this.$el.find('table').colResizable({ disable: true }); //a hack to run garbage collection for resizable table
            this.$el.find('table').colResizable({ disable: false, columnWidths: columnWidths });
        },

        resize: function () {
            var h = $('body').height() - $("#navbar").height() -
                    $(".container-footer").height() - 2;
            this.$el.height(h);
            this.$el.find('tbody').height(h - $('thead').height());
        }
    });
    return TableLayoutManager;
});