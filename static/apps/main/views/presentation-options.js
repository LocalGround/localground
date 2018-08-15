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
            const metadata = this.activeMap.get('metadata');
            return {
                displayLegend: metadata.displayLegend,
                nextPrevButtons: metadata.nextPrevButtons,
                allowPanZoom: metadata.allowPanZoom,
                streetView: metadata.streetview,
                displayTitleCard: metadata.displayTitleCard
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
            this.activeMap.get('metadata').displayLegend = val;
            this.activeMap.save();
        },

        updateNextPrev: function() {
            const val = this.$el.find('#next-prev').prop('checked');
            this.activeMap.get('metadata').nextPrevButtons = val;
            this.activeMap.save();
        },
        updatePanZoom: function() {
            const val = this.$el.find('#pan-zoom').prop('checked');
            this.activeMap.get('metadata').allowPanZoom = val;
            this.activeMap.save();
        },
        updateStreetView: function() {
            const val = this.$el.find('#street-view').prop('checked');
            this.activeMap.get('metadata').streetview = val;
            this.activeMap.save();
        },
        updateTitleCardDisplay: function() {
            const val = this.$el.find('#title-card').prop('checked');
            this.activeMap.get('metadata').displayTitleCard = val;
            this.activeMap.save();
        },

        showTitleCardModal:function (e) {
            var editTitleCard = new EditTitleCard({
                app: this.app,
                activeMap: this.activeMap,
                model: this.activeMap.getTitleCardModel()
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
