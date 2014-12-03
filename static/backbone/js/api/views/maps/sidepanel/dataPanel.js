define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/sidepanel/dataPanelHeader.html",
        "views/maps/sidepanel/projectsMenu",
        "views/maps/sidepanel/projectTags",
        "views/maps/sidepanel/itemListManager",
        "views/maps/sidepanel/filter"
    ],
    function (Marionette, _, $, dataPanelHeader, ProjectsMenu, ProjectTags,
                ItemListManager, DataFilter) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var DataPanel = Marionette.LayoutView.extend({
            /**
             * @lends localground.maps.views.DataPanel#
             */
            template: function () {
                return _.template(dataPanelHeader);
            },

            events: {
                'click #mode_toggle': 'toggleEditMode'
            },
            regions: {
                projectMenu: "#projects-menu",
                projectTags: "#project-tags",
                itemList: "#item-list-manager",
                dataFilter: "#data-filter"
            },
            /**
             * Initializes the dataPanel
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                //this.projectTags.show(new ProjectTags(app, opts));
                //this.panelBody.show(new PanelBody(app, opts));
                // Listen for the "new_collection" event. On each new
                // collection event add a new ItemsView to the DataPanel.
                //app.vent.on("new-collection-created", this.createItemsView.bind(this));
                opts.app.vent.on("adjust-layout", this.resize.bind(this));
            },

            onShow: function () {
                this.projectMenu.show(new ProjectsMenu(this.opts));
                this.projectTags.show(new ProjectTags(this.opts));
                this.itemList.show(new ItemListManager(this.opts));
                this.dataFilter.show(new DataFilter(this.opts));
            },

            /*
             * Renders the HTML for the data panel. Called everytime
             * project data changes. Note that the project panel is
             * only rendered once.
             */
            /*
            //TODO: maybe need to add some onRender behavior?
            render: function () {
                this.$el.empty().append(this.template());
                this.resize();
                return this;
            },
            */
            toggleEditMode: function () {
                if (this.app.getMode() === "view") {
                    this.app.setMode("edit");
                    this.$el.find('#mode_toggle').addClass('btn-info');
                } else {
                    this.app.setMode("view");
                    this.$el.find('#mode_toggle').removeClass('btn-info');
                }
                this.app.trigger('mode-change');

            },

            destroy: function () {
                this.remove();
            },

            resize: function () {
                this.$el.find('.pane-body').height($('body').height() - 140);
            }
        });
        return DataPanel;
    });
