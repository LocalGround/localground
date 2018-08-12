
define([
    "underscore",
    "handlebars",
    "marionette",
    "lib/audio/audio-player",
    "text!./audio-viewer.html"
], function (_, Handlebars, Marionette, AudioPlayer, AudioViewerTemplate) {
    "use strict";
    var AudioViewer = Marionette.ItemView.extend({
        template: Handlebars.compile(AudioViewerTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            this.templateType = this.templateType || 'standard';
            this.render();
        },
        events: {
            'click .detach_media': 'relayDetachMedia',
            'click .edit': 'editAudioFile'
        },
        //className: 'media-items_wrapper',
        //className: 'media-items_wrapper',
        templateHelpers: function () {
            const showHeader = this.collection.length > 0 && this.templateType === 'standard';
            console.log(this.collection.toJSON());
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
            this.collection.each(item => {
                const player = new AudioPlayer({
                    model: item,
                    audioMode: "basic",
                    app: this.app
                });
                this.$el.append(player.$el);
            });
        },
        relayDetachMedia: function(e) {
            this.detachMedia(e);
        },
        editAudioFile: function (e) {
            const audioID = parseInt($(e.target).attr('data-id'));
            const audioModel = this.collection.get(audioID);
            alert(audioModel.get('name'));
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
