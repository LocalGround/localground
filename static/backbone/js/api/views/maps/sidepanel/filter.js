define(["underscore",
        "backbone",
        "jquery",
        "text!" + templateDir + "/sidepanel/dataFilter.html",
        "text!" + templateDir + "/sidepanel/dataFilterItem.html"
        ],
    function (_, Backbone, $, filterTemplate, filterItemTemplate) {
        'use strict';
        /**
         * Class that controls the available projects tags,
         * Extends Backbone.View.
         * @class ProjectTags
         */
        var DataFilter = Backbone.View.extend({
            /**
             * @lends localground.maps.views.ProjectTags#
             */
            events: {
                'click input': 'ignore',
                'click label': 'ignore',
                'click div': 'ignore',
                'click #apply_filter': 'triggerFilter',
                'click #clear_filter': 'clearFilter',
                'blur input': 'updateSQL',
                'click #filter-mode-toggle': 'showSQL'
            },
            /**
             * Initializes the project tags menu (an easy way to remove projects
             * and set them to be active)
             */
            initialize: function (opts) {
                $.extend(this, opts);
                opts.app.vent.on('selected-projects-updated', this.applyFilter, this);
            },
            ignore: function (e) {
                e.stopPropagation();
            },
            render: function () {
                var fields = [
                        "name",
                        "tags",
                        "owner",
                        "caption",
                        "attribution"
                    ],
                    body = '';

                $.each(fields, function () {
                    body += _.template(filterItemTemplate, {
                        name: this,
                        id: 'filter_' + this
                    });
                });
                this.$el.html(_.template(filterTemplate, {body: body}));
            },
            triggerFilter: function (e) {
                if (this.$el.find('.filter-overflow').is(':visible')) {
                    this.buildSQL();
                }
                var sql = this.$el.find('#filter_sql').val();
                if (sql.length > 0) {
                    this.app.vent.trigger('apply-filter', sql);
                } else {
                    this.clearFilter(e);
                }
                e.stopPropagation();
            },
            applyFilter: function () {
                var sql = this.$el.find('#filter_sql').val();
                if (sql.length > 0) {
                    this.app.vent.trigger('apply-filter', sql);
                }
            },
            clearFilter: function (e) {
                this.app.vent.trigger('clear-filter');
                e.stopPropagation();
            },
            showSQL: function (e) {
                this.buildSQL();
                if ($(e.target).html() == "advanced") {
                    $(e.target).html("basic");
                    this.$el.find('.filter-overflow').hide();
                    this.$el.find('.sql').show();
                } else {
                    $(e.target).html("advanced");
                    this.$el.find('.filter-overflow').show();
                    this.$el.find('.sql').hide();
                }
                e.stopPropagation();
            },
            buildSQL: function () {
                var elements = [],
                    sql;
                $.each(this.$el.find('input'), function () {
                    if ($(this).val().length > 0) {
                        elements.push($(this).attr('id').replace("filter_", "") + " like '%" + $(this).val() + "%'");
                    }
                });
                if (elements.length > 0) {
                    sql = "where " + elements.join(" and ");
                } else {
                    sql = '';
                }
                //console.log(sql);
                this.$el.find("#filter_sql").val(sql);
            }
        });
        return DataFilter;
    });
