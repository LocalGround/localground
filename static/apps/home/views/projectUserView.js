define(["jquery",
        "marionette",
        "underscore",
        "handlebars",
        "text!../templates/project-user-item.html"],
    function ($, Marionette, _, Handlebars, ProjectUserFormTemplate) {
        'use strict';
        var ProjectUserView = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
            },
            events: {
                'click .delete-project-user': 'doDelete'
            },
            template: Handlebars.compile(ProjectUserFormTemplate),
            tagName: "tr",
            doDelete: function (e) {
                if (!confirm("Are you sure you want to remove this user from the project?")) {
                    return;
                }
                this.model.destroy();
                e.preventDefault();
            }
        });
        return ProjectUserView;
    });
