/**
 * Created by zmmachar on 12/17/14.
 */
define(["models/view",
        "collections/projects",
        "jquery",
        "config"
    ],
    function (View, Projects, $, Config) {
        'use strict';

        /**
         * The Viewloader class just structes the data
         * necessary to load a view
         * @class ViewLoader
         */
        var ViewLoader = function (app) {
            var updateCollection = function (opts) {
                if (!opts) {
                    //TODO: create standardized way to report errors.
                    return;
                }
                var key = opts.key,
                    models = opts.models,
                    collectionOpts;
                if (!this.collections[key]) {
                    collectionOpts = { key: key, name: opts.name };
                    //A few special hacks for form data:
                    if (key.indexOf("form") !== -1) {
                        collectionOpts.url = '/api/0/forms/' + key.split("_")[1] + '/data/';
                    }
                    this.collections[key] = new opts.Collection([], collectionOpts);

                    // important: this trigger enables the overlayManager
                    // to create a new overlay for each model where the
                    // GeoJSON geometry is defined.
                    this.app.vent.trigger('new-collection-created', {collection: this.collections[key],
                                                                     startVisible: true});

                }
                this.collections[key].add(models, {merge: true});
            };
            /**
             * A dictionary of the various data types available (given
             * the projects that have been selected), and the corresponding
             * data records that have been pulled down from the Data API.
             */
            this.collections = {};

            this.initialize = function (opts) {
                this.view = new View(opts.view);
                this.app = opts.app;
                var that = this;
                this.app.vent.once('map-ready', function () {
                    that.updateCollections(that.view);
                    that.app.vent.trigger('change-center', that.view.get('center'));
                    that.app.vent.trigger('change-zoom', that.view.get('zoom'));
                    that.app.vent.trigger('set-map-type', that.view.get('basemap'));
                });

            };


            /**
             * Because projects have many different types of data
             * associated with them (which must all be treated slightly
             * differently), each type of data is locally stored in its
             * own collection. See config.js to view the various data
             * types associated with a particular project. The config
             * file coordinates between the data stored in the API, and
             * the backbone data structures that manipulate this data.
             * @param {String} key
             * The key refers to the object_type of the data of interest.
             */
            this.getCollection = function (key) {
                return this.collections[key];
            };

            /**
             * Coordinates data pulled down from the data API
             * with the local Backbone collections being stored
             * and manipulated in memory.
             * @method updateCollections
             * @param {Project} project
             * A project detail data structure returned from the
             * Local Ground data API.
             */
            this.updateCollections = function (view) {
                //add child data to the collection:
                var models,
                    configKey,
                    opts,
                    children = view.get("children"),
                    key,
                    modelCreator = function () {
                        models.push(new opts.Model(this, {
                            updateMetadata: children[key].update_metadata
                        }));
                    };

                for (key in children) {
                    if (children.hasOwnProperty(key)) {
                        models = [];
                        configKey = key.split("_")[0];
                        opts = Config[configKey];
                        $.each(children[key].data, modelCreator);

                        $.extend(opts, {
                            name: children[key].name,
                            createMetadata: children[key].create_metadata,
                            key: key,
                            models: models
                        });
                        //"call" method needed to set this's scope:
                        updateCollection.call(this, opts);
                    }
                }
                //add new project to the collection:
                //this.selectedProjects.add(view, {merge: true});
                //this.app.vent.trigger('selected-projects-updated', {projects: this.selectedProjects});
            };


            this.initialize(app);
        };
        return ViewLoader;
    });
