/**
 * This view's job is as follows:
 * 1. Show a list of available maps
 * 2. If user opts to create a new map, trigger the functionality to create
      one (showAddMapModal).
 * 3. If the user chooses to navigate to a different map, delegate to the Router
 *    to instantiate correct functionality.
*/
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
            this.modal = this.app.modal;
            this.hyperlinkMode = 'link';
        },

        className: 'share-settings',

        templateHelpers: function () {
            return {
                hyperlinkMode: this.hyperlinkMode
            };
        },

        events: {
            //'click .add-map': "showAddMapModal"
            'click .link-button': 'showLinkText',
            'click .embed-button': 'showEmbedText'
        },

        showLinkText: function() {
            if (this.hyperlinkMode === 'embed') {
                this.hyperlinkMode = 'link';
                this.render();
            }
        },

        showEmbedText: function() {
            if (this.hyperlinkMode === 'link') {
                this.hyperlinkMode = 'embed';
                this.render();
            }
        },

        saveShareSettings: function() {
            console.log('save');
        }
    });
    return ShareSettings;
});
