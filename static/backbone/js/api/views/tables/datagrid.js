define(["jquery", "backbone", "backgrid"], function ($, Backbone, Backgrid) {
	/**
     * Class that initializes a DataGrid tileset.
     * @class DataGrid
     */
    "use strict";
    var DataGrid = Backbone.View.extend({
        el: "#grid",
        records: null,
        columns: null,
        globalEvents: null,
        columnWidth: 140,
        blankRow: null,
        grid: null,
        initialize: function (opts) {
            // opts should initialize the Grid with a collection of
            // columns and a collection of records.
            opts = opts || {};
            $.extend(this, opts);

            this.blankRow = {
                project_id: this.app.projectID
            };

            this.initEventListeners();

            this.loadGrid();
        },
        reset: function () {
            alert("add");
            this.initLayout();
        },

        initEventListeners: function () {
            var that = this;
            this.globalEvents.on("insertRowTop", function (e) {
                that.insertRowTop(e);
            });
            this.globalEvents.on("insertRowBottom", function (e) {
                that.insertRowBottom(e);
            });
        },

        loadGrid: function () {
            var that = this,
                GridBody = Backgrid.Body.extend({
                    render: function () {
                        var fragment = document.createDocumentFragment(),
                            i,
                            row;
                        this.$el.empty();
                        for (i = 0; i < this.rows.length; i++) {
                            row = this.rows[i];
                            fragment.appendChild(row.render().el);
                        }
                        this.el.appendChild(fragment);
                        // custom code to notify view of a table re-rendering.
                        if (this.rows.length > 0) {
                            that.trigger("row:added", this);
                        }
                        this.delegateEvents();
                        return this;
                    }
                });

            this.grid = new Backgrid.Grid({
                body: GridBody,
                columns: this.columns,
                collection: this.records
            });
            this.listenTo(this, "row:added", this.initLayout);
            this.listenTo(this.records, "reset", this.initLayout);
            this.render();
        },

        render: function () {
            // Render the grid and attach the root to your HTML document
            this.$el.html(this.grid.render().el);
        },

        initLayout: function () {
            this.$el.find('table').addClass('table-bordered');
            this.makeColumnsResizable();
            this.resize();
        },

        makeColumnsResizable: function () {
            var w = (this.columns.length * this.columnWidth) + "px";
            //console.log(this.columns.length);
            $("#grid").find('table, tbody, thead').css({ 'min-width': w });

            this.$el.find('table').colResizable({ disable: true }); //a hack to run garbage collection for resizable table
            this.$el.find('table').colResizable({ disable: false });
        },

        resize: function () {
            this.$el.find('tbody').height($('body').height() - 136);
        },

        insertRowTop: function (e) {
            //	this.records.add({ project_id: 2 }, { at: 0 });
            //	todo: ensure that record auto-populates w/default project selected.
            //  ACTUALLY: we should require that users can only edit when an
            //	active project is selected.
            this.grid.insertRow(this.blankRow, { at: 0 });
            this.initLayout();
            e.preventDefault();
        },

        insertRowBottom: function (e) {
            this.grid.insertRow(this.blankRow, {});
            this.initLayout();
            e.preventDefault();
        },

        insertColumn: function (columnDef) {
            this.$el.find('table').css({'width': 'auto'});
            this.$el.find('th').css({'width': 'auto'});
            this.grid.insertColumn([columnDef]);
            this.makeColumnsResizable();
        }
    });
    return DataGrid;
});
