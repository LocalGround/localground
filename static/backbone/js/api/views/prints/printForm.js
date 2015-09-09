define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/prints/printForm.html"
    ],
    function (Marionette,
              _,
              $,
              printFormTemplate) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * print form
         * @class PrintForm
         */
        var PrintForm = Marionette.CompositeView.extend({
            /**
             * @lends localground.maps.views.PrintForm#
             */
            template: function () {
                return _.template(printFormTemplate);
            },

            tagName: 'div',
            id: 'print-form',
            events: {
                'click .layout-control': 'changeLayout',
                'click #submit': 'generatePrint'
            },

            ui: {
                layoutSelection: '.layout-control',
                projectSelection: '#project-selector'
            },

            childViewContainer: "#project-selector",

            childView: Marionette.ItemView.extend({
                tagName: 'option',
                onRender: function() {
                    if (this.model) {
                        this.$el.val(this.model.get('id'));
                    }
                },
                template: _.template('<%= name %>'),
                modelEvents: {'change': 'render'}
            }),
            /**
             * Initializes the printForm
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.controller = opts.controller;
                this.opts = opts;
                this.collection = opts.availableProjects;
            },

            onShow: function () {
            },

            refreshActiveProject: function () {
                var activeProject = this.app.getActiveProjectID();
                if(activeProject) {
                    this.ui.projectSelection.val(activeProject);
                }
            },

            changeLayout: function (e) {
                var choice = e.target.value;
                this.controller.trigger('change-layout', choice)
            },

            generatePrint: function () {
                this.controller.trigger('generatePrint');
            },

            getFormData: function () {
                return {
                  orientation: this.ui.layoutSelection.filter(':checked').val(),
                  project_id: this.ui.projectSelection.val()
                }
            }

        });
        return PrintForm;
    });
