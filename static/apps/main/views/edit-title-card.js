
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
            let header, description;

            // once map metadata is fully implemented, these conditional statements can be removed
            if (this.activeMap.get('metadata')) {
                if (this.activeMap.get('metadata').titleCardInfo) {
                    header = this.activeMap.get('metadata').titleCardInfo.header;
                    description = this.activeMap.get('metadata').titleCardInfo.description;
                }
            }
            return {
                header: header,
                description: description
            };
        },

        saveTitleCard: function() {
            let header = this.$el.find('.title-card_title').val();
            let description = this.$el.find('.title-card_textarea').val();

            if (this.activeMap.get('metadata')) {
                if (this.activeMap.get('metadata').titleCardInfo) {

                    this.activeMap.get('metadata').titleCardInfo.header = header;
                    this.activeMap.get('metadata').titleCardInfo.description = description;

                    console.log(this.activeMap);
                    /*
                    this.activeMap.save(null, {
                            error: function () {
                                console.error('error');
                            },
                            success: function () {
                                this.app.vent.trigger('hide-modal)
                            }
                        }
                    );
                    */

                }
            }

        }
    });
    return EditTitleCard;
});
