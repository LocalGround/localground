
define([
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/edit-title-card.html"
], function (_, Handlebars, Marionette, EditTitleCardTemplate) {
    "use strict";
    var EditTitleCard = Marionette.ItemView.extend({
        template: Handlebars.compile(EditTitleCardTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            this.modal = this.app.modal;
            this.popover = this.app.popover;
        },

        className: 'edit-title-card-menu',

        templateHelpers: function () {
            return {
                //mapList: this.collection.toJSON(),
                //map: this.activeMap ? this.activeMap.toJSON() : null
            };
        },

        saveTitleCard: function() {
            const title = this.$el.find('.title-card_title').val();
            const description = this.$el.find('.title-card_textarea').val();
        }
    });
    return EditTitleCard;
});
