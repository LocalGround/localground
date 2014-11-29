define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/sidepanel/dataFilter.html"],
    function (Marionette, _, $, dataFilterTemplate) {
        'use strict';
        /**
         * Class that controls the available projects tags,
         * Extends Backbone.View.
         * @class ProjectTags
         */
        var DataFilter = Marionette.LayoutView.extend({
            /**
             * @lends localground.maps.views.ProjectTags#
             */
            events: {
                'click input': 'ignore',
                'click label': 'ignore',
                'click div': 'ignore',
                'click #apply_filter': 'triggerFilter',
                'click #clear_filter': 'clearFilter'
            },
            template: _.template(dataFilterTemplate),
            /**
             * Initializes the project tags menu (an easy way to remove projects
             * and set them to be active)
             */
            initialize: function (opts) {
                $.extend(this, opts);
            },
            ignore: function (e) {
                e.stopPropagation();
            },
            triggerFilter: function (e) {
                var filterText = this.$el.find('#filter_name').val();
                console.log(filterText);
                this.app.vent.trigger('apply-filter', filterText);
                e.stopPropagation();
            },
            clearFilter: function (e) {
                this.app.vent.trigger('clear-filter');
                e.stopPropagation();
            }

        });
        return DataFilter;
    });
