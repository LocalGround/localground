define([
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/share-settings.html"
], function (_, Handlebars, Marionette, ShareSettingsTemplate) {
    "use strict";
    let ShareSettings = Marionette.ItemView.extend({
        template: Handlebars.compile(ShareSettingsTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            this.linkMode = 'link';
        },

        className: 'share-settings',

        templateHelpers: function () {
            return {
                linkMode: this.linkMode,
                sharing_url: this.activeMap.get('sharing_url'),
                embed_url: `<iframe src="${this.activeMap.get('sharing_url')}" style="width: 950px; height: 350px; margin-left: auto; margin-right: auto; display: block; border: none;"></iframe>`
            };
        },

        events: {
            'click .link-button': 'showLinkText',
            'click .embed-button': 'showEmbedText'
        },

        showLinkText: function() {
            if (this.linkMode === 'embed') {
                this.linkMode = 'link';
                this.render();
            }
        },

        showEmbedText: function() {
            if (this.linkMode === 'link') {
                this.linkMode = 'embed';
                this.render();
            }
        },

        saveShareSettings: function() {
            console.log('save');
        }
    });
    return ShareSettings;
});
