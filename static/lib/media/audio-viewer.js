
define([
    "underscore",
    "handlebars",
    "marionette",
    "lib/audio/audio-player",
    "lib/media/edit-media-info",
    "text!./audio-viewer.html"
], function (_, Handlebars, Marionette, AudioPlayer, EditMediaInfoView, AudioViewerTemplate) {
    "use strict";
    var AudioViewer = Marionette.ItemView.extend({
        template: Handlebars.compile(AudioViewerTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            this.templateType = this.templateType || 'standard';
            this.secondaryModal = this.app.secondaryModal;
            this.render();
        },
        // events: {
        //     //'click .detach_media': 'relayDetachMedia',
        //     'click .edit': 'editAudioFile'
        // },
        //className: 'media-items_wrapper',
        className: 'media-items_wrapper',
        templateHelpers: function () {
            const showHeader = this.collection.length > 0 && this.templateType === 'standard';
            return {
                audio: this.collection.toJSON(),
                showHeader: showHeader,
                templateType: this.templateType
            };
        },
        onRender: function() {
            this.renderAudioPlayers();
            this.enableMediaReordering();
        },
        renderAudioPlayers: function () {
            const opts = {
                audioMode: "basic",
                app: this.app,
                editAudio: this.editAudio.bind(this)
            }
            if (this.editFunction) {
                opts.editFunction = this.editFunction.bind(this);
            }
            if (this.detachMediaFunction) {
                opts.detachMediaFunction = this.detachMediaFunction.bind(this)
            }
            this.collection.each(item => {
                opts.model = item;
                const player = new AudioPlayer(opts);
                this.$el.append(player.$el);
            });
        },

        editAudio: function (audioModel) {
            const editMediaInfo = new EditMediaInfoView({
                app: this.app,
                model: audioModel
            });

            this.secondaryModal.update({
                title: 'Edit Media Info',
                view: editMediaInfo,
                width: 600,
                saveButtonText: "Save",
                showDeleteButton: false,
                showSaveButton: true,
                saveFunction: editMediaInfo.saveMediaInfo.bind(editMediaInfo)
            });
            this.secondaryModal.show();
        },

        enableMediaReordering: function () {
            if (this.updateOrdering) {
                this.$el.sortable({
                    helper: this.fixHelper,
                    items : '.audio-container',
                    update: (event, ui) => {
                        const $elem = ui.item.find('.detach_media');
                        const id = parseInt($elem.attr("data-id"));
                        const overlay_type = $elem.attr("data-type");
                        const newOrder = ui.item.index() - 1;
                        this.updateOrdering(id, overlay_type, newOrder);
                    }
                }).disableSelection();
            }
        }
    });
    return AudioViewer;
});
