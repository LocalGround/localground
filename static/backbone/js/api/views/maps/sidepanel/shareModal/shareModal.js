define(["marionette",
        "underscore",
        "text!" + templateDir + "/modals/shareModal.html",
        "collections/snapshots",
        "views/maps/sidepanel/shareModal/snapshotItem",
        "models/snapshot",
        "lib/maps/geometry/geometry",
        "views/maps/sidepanel/shareModal/confirmation"
    ],
    function (Marionette, _, shareModal, Snapshots, SnapshotItem, Snapshot, Geometry, Confirmation) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * share Snapshot modal
         * @class DataPanel
         */

        var ShareModal = Marionette.CompositeView.extend({
            id: 'share-modal-wrapper',
            childView: SnapshotItem,
            childViewContainer: "#snapshot-list-container",
            activeSnapshotItem: null,
            template: function () {
                return _.template(shareModal);
            },

            ui: {
                saveName: '#save-snapshot-name',
                saveCaption: '#save-snapshot-caption',
                snapshotFields: '.snapshot-caption',
                urlModal: '#url-modal',
                loadButton: '.load'
            },

            events: {
                'click .snapshot-item': 'selectSnapshot',
                'input #save-snapshot-name': 'checkInput',
                'click .save': 'trySaveSnapshot',
                'click .delete-snapshot': 'deleteSnapshot',
                'click .dismiss-modal': 'cleanUp',
                'click .load': 'loadSnapshot'
            },

            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.geometry = new Geometry();
                this.collection = new Snapshots();
                this.collection.comparator = function (model) {return -model.id; };
                this.app.vent.trigger('load-snapshot-list', this.collection);
            },

            setSerializedEntities: function (serializedEntities) {
                this.serializedEntities = serializedEntities;
            },

            selectSnapshot: function (e) {
                var target = e.currentTarget;
                this.unsetActiveSnapshotItem();
                this.setActiveSnapshotItem(target);
            },

            unsetActiveSnapshotItem: function () {
                if (this.activeSnapshotItem) {
                    this.activeSnapshotItem.classList.remove('active');
                    this.activeSnapshotItem = null;
                    this.ui.loadButton.addClass('disabled');
                    this.ui.saveCaption.val('');
                }
            },

            //WARNING: MAY RETURN UNDEFINED
            getActiveSnapshotObject: function () {
                //Just grab the Snapshot from the collection by id
                return this.collection.get(this.activeSnapshotItem.firstChild.dataset.id);
            },

            resetInput: function () {
                this.ui.snapshotFields.val('');
            },

            setActiveSnapshotItem: function (target) {
                this.activeSnapshotItem = target;
                this.activeSnapshotItem.classList.add('active');
                this.ui.loadButton.removeClass('disabled');
                this.ui.saveName.val(target.firstChild.dataset.name);
                this.ui.saveCaption.val(target.firstChild.dataset.caption);


            },

            checkInput: function (e) {
                this.unsetActiveSnapshotItem();
                var match = this.collection.findWhere({name: e.target.value});
                if (match) {
                    this.setActiveSnapshotItem(document.getElementById('snapshot-item-' + match.id));
                }
            },


            trySaveSnapshot: function (e) {
                if (this.activeSnapshotItem) {
                    var snapshot = this.getActiveSnapshotObject();
                    Confirmation.confirm({
                        message: "Really overwrite '" + snapshot.get('name') + "'?" +
                            "  This will replace all of its contents with your current state.",
                        callback: this.saveSnapshot.bind(this)
                    });
                } else {
                    this.saveSnapshot();
                }
            },

            saveSnapshot: function (e) {
                var snapshot = null;
                //A convenience method to make sure the collection is sorted properly
                if (this.activeSnapshotItem) {
                    snapshot = this.getActiveSnapshotObject();
                }
                if (!snapshot) {
                    snapshot = new Snapshot({
                        name: this.ui.saveName.val(),
                        caption: '',
                        tags: '',
                        slug: btoa(Math.random() * 1000000000).replace(/=/g, '-') //Generate random slug string
                    });
                }
                snapshot.set('entities', this.serializedEntities);
                snapshot.set('center', JSON.stringify(this.geometry.getGeoJSON(this.app.map.getCenter())));
                snapshot.set('zoom', this.app.map.getZoom());
                var mapName = this.app.map.mapTypeId;
                //capitalize first letter
                mapName = mapName.charAt(0).toUpperCase() + mapName.slice(1);
                snapshot.set('basemap', _.findWhere(this.opts.tilesets, {name: mapName}).id);
                snapshot.set('caption', this.ui.saveCaption.val());
                snapshot.set('Snapshot_authority', 3);
                snapshot.save(null, {success: function (newSnapshot) {
                    this.collection.add(newSnapshot);
                    this.collection.sort();
                    this.collection.trigger('reset');
                    this.resetInput();
                }.bind(this)});
            },


            loadSnapshot: function () {
                var snapshot = this.getActiveSnapshotObject();
                //If all is well and we have the corresponding Snapshot...
                if (snapshot) {
                    //Trigger event so that parent layout can handle
                    //dispatching calls to other children as needed
                    //Check dataPanel.js for listener
                    this.trigger('load-snapshot', snapshot);
                }
            },

            deleteSnapshot: function (e) {
                var model = this.collection.get(e.currentTarget.parentElement.dataset.id);
                if (model) {
                    model.destroy();
                    //this.collection.remove(model);
                }
                e.stopPropagation();
            },

            cleanUp: function () {
                this.unsetActiveSnapshotItem();
                this.resetInput();
            },

            showModal: function () {
                this.$el.find('#share-modal').modal();
            }



        });
        return ShareModal;
    });