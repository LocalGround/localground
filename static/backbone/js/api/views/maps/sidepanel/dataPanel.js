define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/sidepanel/dataPanelHeader.html",
        "views/maps/sidepanel/menus/projectsMenu",
        "views/maps/sidepanel/projectTags",
        "views/maps/sidepanel/itemListManager",
        "views/maps/sidepanel/shareModal/shareModal",
        "views/maps/sidepanel/uploadModal",
        "views/maps/sidepanel/printModal"
    ],
    function (Marionette,
              _,
              $,
              dataPanelHeader,
              ProjectsMenu,
              ProjectTags,
              ItemListManager,
              ShareModal,
              UploadModal,
              PrintModal) {
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
                'click #mode_toggle': 'toggleEditMode',
                'click #share-data': 'showShareModal',
                'click #upload': 'showUploadModal',
                'click #print': 'showPrintModal'
            },
            regions: {
                projectMenu: "#projects-menu",
                projectTags: "#project-tags",
                itemList: "#item-list-manager",
                shareModalWrapper: "#share-modal-wrapper",
                uploadModalWrapper: "#upload-modal-wrapper",
                printModalWrapper: "#print-modal-wrapper"
            },
            /**
             * Initializes the dataPanel
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                opts.app.vent.on("adjust-layout", this.resize.bind(this));
            },

            onShow: function () {
                this.projectMenu.show(new ProjectsMenu(this.opts));
                this.projectTags.show(new ProjectTags(this.opts));
                this.itemList.show(new ItemListManager(this.opts));
                this.shareModalWrapper.show(new ShareModal(this.opts));
                this.uploadModalWrapper.show(new UploadModal(_.defaults({url:'/upload/embed'}, this.opts)));
                this.listenTo(this.shareModalWrapper.currentView, 'load-snapshot', this.loadSnapshot);
            },

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
            },

            showShareModal: function () {
                this.shareModalWrapper.currentView.setSerializedEntities(this.serializeActiveEntities());
                this.shareModalWrapper.currentView.showModal();
            },

            showUploadModal: function () {
                this.uploadModalWrapper.currentView.showModal();
            },

            showPrintModal: function () {
                this.printModalWrapper.show(new PrintModal(this.opts));
                this.printModalWrapper.currentView.showModal();
            },

            //A convenience method to gather all currently active map markers for saving in a view
            serializeActiveEntities: function () {
                var entities = [];
                _.each(this.itemList.currentView.collections, function (collection) {
                    var entityIds = collection.where({'showingOnMap': true}).map(function (model) {return model.id; });
                    if (entityIds.length > 0) {
                        entities.push({
                            overlay_type: collection.first().attributes.overlay_type,
                            ids: entityIds
                        });
                    }
                });
                return JSON.stringify(entities);
            },

            loadSnapshot: function (snapshot) {
                var v = snapshot.toJSON(),
                    //Take all unique project ids from the snapshot
                    projectIds = _.chain(v.children)
                        .map(function (collection) {
                            return _.pluck(collection.data, 'project_id');
                        }).flatten().uniq().value();

                //dispatch call to projectMenu to load appropriate projects
                this.projectMenu.currentView.loadProjects(projectIds);
                //dispatch call to itemManager to only show appropriate items
                this.itemList.currentView.loadSnapshot(v);
                //set zoom
                this.app.vent.trigger('change-zoom', v.zoom);
                //set map type to the view's map type
                this.app.vent.trigger('set-map-type', v.basemap);
                //set center to view's center
                var c = v.center,
                    centerPoint = new google.maps.LatLng(c.coordinates[1], c.coordinates[0]);

                this.app.vent.trigger('change-center', centerPoint);

            }
        });
        return DataPanel;
    });
