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
    "models/map",
    "views/generate-print",
    "apps/main/views/left/new-map-modal-view",
    "apps/main/views/map-menu",
    "apps/main/views/share-settings",
    "apps/main/views/presentation-options",
    "text!../templates/breadcrumbs.html"
], function (_, Handlebars, Marionette, Map, PrintLayoutView,
        CreateMapForm, MapMenu, ShareSettings, PresentationOptions, BreadcrumbsTemplate) {
    "use strict";
    var Toolbar = Marionette.ItemView.extend({
        template: Handlebars.compile(BreadcrumbsTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            this.modal = this.app.modal;
            this.popover = this.app.popover;
        },
        collectionEvents: {
            update: 'render',
        },
        templateHelpers: function () {
            return {
                name: this.model.get("name"),
                map: this.activeMap ? this.activeMap.toJSON() : null
            };
        },
        events: {
            'click #print-button': 'showPrintModal',
            'click #map-menu': 'showMapMenu',
            'click .share': 'showShareMenu' ,
            'click .presentation-options-btn': 'showPresentationOptions'
        },

        showMapMenu: function(e) {
            this.popover.update({
                $source: e.target,
                view: new MapMenu({
                    app: this.app,
                    activeMap: this.activeMap,
                    collection: this.collection
                }),
                placement: 'bottom',
                width: '150px'
            });
        },

        showPresentationOptions: function(e) {
            this.popover.update({
                $source: e.target,
                view: new PresentationOptions({
                    app: this.app,
                    activeMap: this.activeMap,
                    collection: this.collection
                }),
                placement: 'bottom',
                width: '270px'
            });
        },

        showShareMenu: function() {
            let shareSettings = new ShareSettings({
                app: this.app,
                activeMap: this.activeMap
            });
            this.modal.update({
                bodyClass: 'gray',
                app: this.app,
                view: shareSettings,
                title: 'Sharing Settings',
                saveButtonText: 'Save',
                saveFunction: shareSettings.saveShareSettings.bind(shareSettings),
                closeButtonText: "Cancel",
                width: 600,
                height: null,   
                showSaveButton: true,
                showDeleteButton: false
            });
            this.modal.show();

        },

        //TODO: come back to this. Where does the print button go?
        showPrintModal: function (opts) {
            var printLayout = new PrintLayoutView({
                app: this.app
            });
            this.modal.update({
                bodyClass: 'gray',
                app: this.app,
                view: printLayout,
                title: 'Generate Print',
                saveButtonText: 'Print',
                width: 1000,
                height: null,
                closeButtonText: "Done",
                showSaveButton: true,
                showDeleteButton: false,
                saveFunction: printLayout.callMakePrint.bind(printLayout)
            });
            this.modal.show();
        }
    });
    return Toolbar;
});
