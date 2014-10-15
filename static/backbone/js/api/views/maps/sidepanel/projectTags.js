define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/sidepanel/projectTag.html"],
    function (Marionette, _, $, projectTagTemplate) {
        'use strict';
        /**
         * Class that controls the available projects tags,
         * Extends Backbone.View.
         * @class ProjectTags
         */
        var ProjectTags = Marionette.CollectionView.extend({
            /**
             * @lends localground.maps.views.ProjectTags#
             */
            events: {
                'click .fa-close': 'removeProject',
                'click .alert': 'setActive'
            },
            childView: Marionette.ItemView.extend({
                template: _.template(projectTagTemplate),
                tagName: "span",
                modelEvents: {'change': 'render'}
            }),

            /**
             * Initializes the project tags menu (an easy way to remove projects
             * and set them to be active)
             */
            initialize: function (opts) {
                this.collection = opts.projects;
                this.app = opts.app;
               // opts.app.vent.on('selected-projects-updated', this.renderProjects);
                //this.render();
            },
            /** A rendered projectItem template */
            /*
            render: function () {
                if (!this._projects) {
                    return;
                }
                var that = this;
                this.$el.empty();
                this._projects.each(function (model) {
                    var opts = model.toJSON();
                    opts.isActive = (model.id == that.sb.getActiveProjectID());
                    that.$el.append($(that.template(opts)));
                });
            },*/
            /*
            renderProjects: function (data) {
                if (data && data.projects) {
                    this._projects = data.projects;
                }
                this.render();
            },
            */

            removeProject: function (e) {
                this.collection.remove($(e.currentTarget).parent().find("input").val());
            },

            setActive: function (e) {
                var project = this.collection.get($(e.currentTarget).find("input").val());
                if (project) {
                    project.set('isActive', true);
                }
                e.stopPropagation();
            },

            destroy: function () {
                this.remove();
            }

        });
        return ProjectTags;
    });
