/**
 * Created by zmmachar on 10/15/14.
 */
define(["marionette",
        "underscore",
        "text!" + templateDir + "/sidepanel/projectItem.html"],
    function (Marionette, _, ProjectTagTemplate) {
        "use strict";
        var ProjectTag = Marionette.ItemView.extend({
            template: _.template(ProjectTagTemplate)
        });

        return ProjectTag;

    });
