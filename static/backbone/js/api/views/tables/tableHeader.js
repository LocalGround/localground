define(["jquery",
        "backbone",
        "collections/forms",
        "views/tables/table-utilities-mixin",
        "text!../../../templates/spreadsheet/navbar.html",
        "jquery.bootstrap"
        ], function ($, Backbone, Forms, Utilities, Template) {
    "use strict";
    var TableHeader = Backbone.View.extend({
        el: "#navbar",
        globalEvents: null,
        events: {
            'click #add_row_top': 'triggerInsertRowTop',
            'click #add_row_bottom': 'triggerInsertRowBottom',
            'click .query': 'triggerQuery',
            'click .clear': 'triggerClearQuery',
            'click #add_column': 'triggerInsertColumn'
        },
        initialize: function (opts) {
            $.extend(this, opts);
            this.ensureRequiredParam("app");
            this.ensureRequiredParam("globalEvents");
            this.collection = new Forms();
            this.loadFormSelector();
            this.render();
            this.listenTo(this.collection, "reset", this.navigateToTable);
        },
        render: function () {
            this.$el.html(_.template(Template));
            return this;
        },
        navigateToTable: function () {
            // if a current route hasn't been specified already in the URL,
            // select a default one:
            if (!Backbone.history.fragment) {
                this.app.router.navigate("/" + this.collection.models[0].id, true);
            }
        },
        loadFormSelector: function () {
            var that = this,
                successFunction = function () {
                    var $tbl = that.$el.find('#tableSelect');
                    $tbl.empty();
                    $.each(that.collection.models, function () {
                        $tbl.append(
                            $('<li></li>').append(
                                $('<a class="change-table"></a>')
                                    .html(this.get("name"))
                                    .attr("href", "#/" + this.id)
                            )
                        );
                    });
                    $('.dropdown-toggle').dropdown();
                };

            this.collection.fetch({
                success: successFunction,
                reset: true
            });
        },
        triggerInsertRowTop: function (e) {
            this.globalEvents.trigger("insertRowTop", e);
            e.preventDefault();
        },
        triggerInsertRowBottom: function (e) {
            this.globalEvents.trigger("insertRowBottom", e);
            e.preventDefault();
        },
        triggerQuery: function (e) {
            var sql = this.$el.find('#query_text').val().trim();
            if (sql.toLowerCase().indexOf("where") == -1 && sql.length > 0) {
                sql = "where " + sql;
                this.$el.find('#query_text').val(sql);
            }
            this.globalEvents.trigger("requery", sql);
            e.preventDefault();
        },
        triggerClearQuery: function (e) {
            this.$el.find('#query_text').val("");
            this.triggerQuery(e);
        },
        triggerInsertColumn: function (e) {
            this.globalEvents.trigger("insertColumn", e);
        }
    });
    _.extend(TableHeader.prototype, Utilities);
    return TableHeader;
});