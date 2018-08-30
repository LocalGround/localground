
define([
    "underscore",
    "handlebars",
    "marionette",
    "lib/audio/audio-player",
    "text!./edit-media-info.html"
], function (_, Handlebars, Marionette, AudioPlayer, EditMediaInfoTemplate) {
    "use strict";
    var EditMediaInfo = Marionette.ItemView.extend({
        template: Handlebars.compile(EditMediaInfoTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            this.secondaryModal = this.app.secondaryModal;
        },
        
        className: 'edit-media-info',

        onRender: function() {
            if (this.model.get('overlay_type') === 'audio') {
                this.audioPlayer = new AudioPlayer({
                    model: this.model,
                    app: this.app,
                    panelStyles: this.panelStyles,
                    audioMode: "detail",
                    className: "audio-detail"
                });
                this.$el.find(".edit-audio").append(this.audioPlayer.$el);
            }
        },

        saveMediaInfo: function () {
            this.model.set('attribution', this.$el.find('#media-attribution').val());
            this.model.set('caption', this.$el.find('#media-caption').val());
            if (this.model.get('overlay_type') === 'audio') {
                this.model.set('name', this.$el.find('#media-name').val());
            }
            this.model.save(null, {
                success: () => {
                    this.secondaryModal.hide();
                }
            });
        }
    });
    return EditMediaInfo;
});
