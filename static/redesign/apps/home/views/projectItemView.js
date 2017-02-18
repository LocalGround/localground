define(["marionette",
        "underscore",
        "handlebars",
        "text!../templates/project-item.html"],
    function (Marionette, _, Handlebars, ItemTemplate) {
        'use strict';

        var ProjectItemView = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                Marionette.CompositeView.prototype.initialize.call(this);
            },

            template: Handlebars.compile(ItemTemplate),
            events: {
                'click .action': 'shareModal',
                'click' : "linkToProject"
                //'click #delete_project': 'deleteProject'
            },
            linkToProject: function () {
                var url = this.$el.find(".project-overview").attr("data-url");
                window.location = url;
            },

            className: "project-card",

            modelEvents: {
                // When data from Item view changes anywhere and anytime,
                // re-render to update
                "change": "render"
            },

            shareModal: function () {
                //tell the home-app to show the share-project modal:
                this.app.vent.trigger('share-project', { model: this.model });
            },

            templateHelpers: function () {
                return {
                    projectUsers: this.model.projectUsers.toJSON()
                };
            },

            deleteProject: function () {
                if (!confirm("Are you sure you want to delete this project?")) {
                    return;
                }
                this.model.destroy();

            }
        });
        return ProjectItemView;
    });
