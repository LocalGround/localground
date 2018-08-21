
define([
    "underscore",
    "handlebars",
    "marionette",
    "text!./edit-media-info.html"
], function (_, Handlebars, Marionette, EditMediaInfoTemplate) {
    "use strict";
    var EditMediaInfo = Marionette.ItemView.extend({
        template: Handlebars.compile(EditMediaInfoTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            this.secondaryModal = this.app.secondaryModal;
        },
        
        className: 'edit-media-info',

        templateHelpers: function () {
            return {
                author: this.model.get('attribution'),
                caption: this.model.get('caption'),
                name: this.model.get('name')
            };
        },

        saveMediaInfo: function () {
            this.model.set('attribution', this.$el.find('#media-attribution').val());
            this.model.set('name', this.$el.find('#media-name').val());
            this.model.set('caption', this.$el.find('#media-caption').val());
            
            this.model.save();
            this.render();
        }
    });
    return EditMediaInfo;
});
