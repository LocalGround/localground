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
                this.map = printmap.map;
                this.printMapRegion.show(printmap);
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
                  newTitle = 'Click to enter a map title'
                }
                this.ui.title.text(newTitle);
                this.ui.titleInput.hide();
                this.ui.title.show();
            },

            hideDescriptionInput: function () {
                var newDescription = event.target.value;
                if(!newDescription) {
                  newDescription = 'Click to enter instructions'
                }
                this.ui.description.text(newDescription);
                this.ui.descriptionInput.hide();
                this.ui.description.show();
            }


                
        });
        return PrintMockup;
    });
