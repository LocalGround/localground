define(["marionette",
        "underscore",
        "views/prints/printMap",
        "text!" + templateDir + "/prints/printMockup.html"
    ],
    function (Marionette,
              _,
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
            DEFAULT_CAPTION: 'Click to enter instructions',

            tagName: 'div',
            id: 'print-mockup',
            regions: {
                printMapRegion: "#print-map-canvas"
            },
            ui: {
                title: '#print-map-title',
                titleInput: '#print-map-title-input',
                caption: '#print-map-caption',
                captionInput: '#print-map-caption-input'
            },
            events: {
                'click #print-map-title': 'showTitleInput',
                'click #print-map-caption': 'showCaptionInput',
                'blur #print-map-title-input': 'hideTitleInput',
                'blur #print-map-caption-input': 'hideCaptionInput'
            },
            /**
             * Initializes the printMockup
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.firstLoad = true;
                this.app = opts.app;
                this.opts = opts;
                this.controller = opts.controller;
                this.listenTo(this.controller, 'change-layout', this.changeLayout);
            },

            onShow: function () {
                this.printMap = new PrintMap(_.defaults({mapContainerID: "print-map-canvas"}, this.opts));
                this.printMapRegion.show(this.printMap);
                this.map = this.printMap.map;
                this.mapView = this.printMap;
            },

            resizeMap: function () {
                try {
                    google.maps.event.trigger(this.map, "resize");
                } catch (e) {
                    // for Jasmine tests
                }
                // initialCenter: this is a hack to make sure that the print modal
                // centers correctly on first load:
                if (this.firstLoad) {
                    try {
                        this.map.setCenter(this.printMap.initialCenter);
                    } catch (e1) {
                        // Jasmine tests
                    }
                }
                this.firstLoad = false;
            },

            changeLayout: function (choice) {
                this.el.className = choice;
                this.resizeMap();
            },

            showTitleInput: function () {
                this.ui.title.hide();
                this.ui.titleInput.show();
                this.ui.titleInput.focus();
            },

            showCaptionInput: function () {
                this.ui.caption.hide();
                this.ui.captionInput.show();
                this.ui.captionInput.focus();
            },

            hideTitleInput: function (event) {
                var newTitle = event.target.value;
                if (!newTitle) {
                    newTitle = this.DEFAULT_TITLE;
                }
                this.ui.title.text(newTitle);
                this.ui.titleInput.hide();
                this.ui.title.show();
            },

            hideCaptionInput: function (event) {
                var newCaption = event.target.value;
                if (!newCaption) {
                    newCaption = this.DEFAULT_CAPTION;
                }
                this.ui.caption.text(newCaption);
                this.ui.captionInput.hide();
                this.ui.caption.show();
            },

            getFormData : function () {
                return {
                    map_title: this.getTitle(),
                    instructions: this.getInstructions(),
                    zoom: this.map.zoom,
                    center: JSON.stringify({
                        "type": "Point",
                        "coordinates": [
                            this.map.center.lng(),
                            this.map.center.lat()
                        ]
                    }),
                    map_provider: this.mapView.tileManager.getMapTypeId()
                };
            },

            getTitle: function () {
                return this.ui.titleInput.val();
            },

            getInstructions: function () {
                return this.ui.captionInput.val();
            }
        });
        return PrintMockup;
    });
