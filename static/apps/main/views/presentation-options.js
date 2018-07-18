define([
    "underscore",
    "handlebars",
    "marionette",
    "apps/main/views/edit-title-card",
    "text!../templates/presentation-options.html"
], function (_, Handlebars, Marionette, EditTitleCard, PresentationOptionsTemplate) {
    "use strict";
    var PresentationOptions = Marionette.ItemView.extend({
        template: Handlebars.compile(PresentationOptionsTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            this.modal = this.app.modal;
        },

        className: 'presentation-options',

        templateHelpers: function () {
            return {
                // mapList: this.collection.toJSON(),
                // map: this.activeMap ? this.activeMap.toJSON() : null
            };
        },

        events: {
             'click #display-legend': 'updateDisplayLegend',
             'click #next-prev': 'updateNextPrev',
             'click #pan-zoom': 'updatePanZoom',
             'click #street-view': 'updateStreetView',
             'click #title-card': 'updateTitleCardDisplay',
             'click #edit-title-card': 'showTitleCardModal'

        },

        updateDisplayLegend: function() {
            const val = this.$el.find('#display-legend').prop('checked');
            console.log('#display-legend',val);
        },

        updateNextPrev: function() {
            const val = this.$el.find('#next-prev').prop('checked');
            console.log('#next-prev', val);
        },
        updatePanZoom: function() {
            const val = this.$el.find('#pan-zoom').prop('checked');
            console.log('#pan-zoom', val);
        },
        updateStreetView: function() {
            const val = this.$el.find('#street-view').prop('checked');
            console.log('#street-view', val);
        },
        updateTitleCardDisplay: function() {
            const val = this.$el.find('#title-card').prop('checked');
            console.log('#title-card', val);
        },

        showTitleCardModal:function (e) {
            var editTitleCard = new EditTitleCard({
                app: this.app,
                activeMap: this.activeMap
            });

            this.modal.update({
                view: editTitleCard,
                title: 'Edit Title Card',
                width: 400,
                saveButtonText: "Save",
                closeButtonText: "Cancel",
                showSaveButton: true,
                saveFunction: editTitleCard.saveTitleCard.bind(editTitleCard),
                showDeleteButton: false
            });

            this.modal.show();
            if (e) { e.preventDefault(); }
        },
    });
    return PresentationOptions;
});
