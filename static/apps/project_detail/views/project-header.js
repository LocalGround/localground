define(["marionette",
        "handlebars",
        "text!../templates/project-header.html",
    ],
    function (Marionette, Handlebars, ProjectHeaderTemplate) {
        'use strict';

        var ProjectHeaderView = Marionette.ItemView.extend({
            template: Handlebars.compile(ProjectHeaderTemplate),
            initialize: function (opts) {
                var that = this;
                _.extend(this, opts);
                this.modal = this.app.modal;
            },
            events: {
            } 
        });
        return ProjectHeaderView;
    });
