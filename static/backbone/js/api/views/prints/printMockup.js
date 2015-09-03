define(["marionette",
        "underscore",
        "jquery",
        "views/prints/printMap",
        "text!" + templateDir + "/prints/printMockup.html"
    ],
    function (Marionette,
              _,
              $,
              PrintMap,
              printMockupTemplate) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * print mockup
         * @class PrintMockup
         */ 
        var PrintMockup = Marionette.LayoutView.extend({
            /**
             * @lends localground.prints.views.PrintMockup#
             */
            template: function () {
                return _.template(printMockupTemplate);
            },

            DEFAULT_TITLE: 'Click to enter a map title',
            DEFAULT_DESCRIPTION: 'Click to enter instructions',

            tagName: 'div',
            id: 'print-mockup',
            regions: {
                printMapRegion: "#print-map-canvas",
            },
            ui: {
                title: '#print-map-title',
                titleInput: '#print-map-title-input',
                description: '#print-map-description',
                descriptionInput: '#print-map-description-input'
            },
            events: {
                'click #print-map-title': 'showTitleInput',
                'click #print-map-description': 'showDescriptionInput',
                'blur #print-map-title-input': 'hideTitleInput',
                'blur #print-map-description-input': 'hideDescriptionInput'
            },
            /**
             * Initializes the printMockup
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.controller = opts.controller;
                this.collection = opts.projects;
                this.listenTo(this.controller, 'change-layout', this.changeLayout);
            },

            onShow: function () {
                var printmap = new PrintMap(_.defaults({mapContainerID: "print-map-canvas"},this.opts));
                this.printMapRegion.show(printmap);
                this.map = printmap.map;
                this.mapView = printmap;
            },

            resizeMap: function () {
                google.maps.event.trigger(this.map, "resize");
            },

            changeLayout: function (choice) {
                this.el.className = choice;
            },
            
            showTitleInput: function () {
                this.ui.title.hide();
                this.ui.titleInput.show();
                this.ui.titleInput.focus();
            },

            showDescriptionInput: function () {
                this.ui.description.hide();
                this.ui.descriptionInput.show();
                this.ui.descriptionInput.focus();
            },

            hideTitleInput: function (event) {
                var newTitle = event.target.value;
                if(!newTitle) {
                  newTitle = this.DEFAULT_TITLE;
                }
                this.ui.title.text(newTitle);
                this.ui.titleInput.hide();
                this.ui.title.show();
            },

            hideDescriptionInput: function () {
                var newDescription = event.target.value;
                if(!newDescription) {
                  newDescription = this.DEFAULT_DESCRIPTION;
                }
                this.ui.description.text(newDescription);
                this.ui.descriptionInput.hide();
                this.ui.description.show();
            },

            getFormData : function () {
                return {
                    map_title: this.getTitle(),
                    instructions: this.getInstructions(),
                    zoom: this.map.zoom,
                    center_lat: this.map.center.lat(),
                    center_lng: this.map.center.lng(),
                    map_provider: this.mapView.tileManager.getMapTypeId()
                }
            },

            getTitle: function () {
                return this.ui.titleInput.val();
            },

            getInstructions: function () {
                return this.ui.descriptionInput.val();
            }


                
        });
        return PrintMockup;
    });
