define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "text!../templates/rename-dataset.html"
],
    function ($, _, Marionette, Handlebars, RenameDatasetTemplate) {
        'use strict';
        /**
         * model --> Dataset
         */
        var RenameDataset = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(RenameDatasetTemplate);
            },
            error: null,
            templateHelpers: function () {
                return {
                    error: this.error
                };
            },

            _validateDatasetName: function () {
                const name = this.$el.find('#dataset_name').val();
                const description = this.$el.find('#dataset_description').val();
                if (name.length > 0) {
                    this.model.set('name', name);
                    this.model.set('description', description);
                } else {
                    this.error = "A valid dataset name is required";
                    this.render();
                    return false;
                }
                return true;
            },

            _clearErrorMessages: function () {
                this.error = null;
            },

            commitData: function () {
                this._clearErrorMessages();
                const isValid = this._validateDatasetName();
                return isValid;
            },

            saveDataset: function () {
                const isValid = this.commitData();
                if (!isValid) {
                    return;
                }
                this.model.save(null, {
                    dataType:"text",
                    success: (model, response) => {
                        this.dataset.trigger('renamed');
                        this.sourceModal.hide();
                    },
                    error: (model, response) => {
                        try {
                            response = JSON.parse(response.responseText);
                            this.app.vent.trigger('error-message', response.detail);
                        } catch (e) {
                            console.error(e);
                            this.app.vent.trigger('error-message', response.responseText);
                        }
                    }
                });

            },
            onShow: function () {
                setTimeout(() => {
                    this.$el.find('#dataset_name').focus().select();
                }, 50);
            }
            // reloadDataset: function () {
            //     /*
            //      * This method synchronizes the field rename with any
            //      * dependent models in the dataManager:
            //      *   1. Re-queries the dataset (to refresh column headings)
            //      *   2. If necessary, requeries the layer
            //      *     (to update the symbol rules and group_by attribute)
            //      */
            //     this.app.dataManager.reloadDatasetFromServer(
            //         this.dataset,
            //         this.reloadDependentLayers.bind(this)
            //     );
            //     // this.dataset.fetch({
            //     //     success: this.reloadDependentLayers.bind(this)
            //     // });
            // },
            // reloadDependentLayers: function () {
            //     // if the current field no longer exists and there's a
            //     // field dependency, then the active field has been
            //     // renamed...requires further coordination across
            //     // dependent layers:
            //     this.app.vent.trigger('field-updated');
            //     const layers = this.dataset.getDependentLayers(this.app.dataManager);
            //     layers.forEach(layer => {
            //         if (layer.hasFieldDependency() && !layer.getGroupByField(this.app.dataManager)) {
            //             layer.refreshFromServer();
            //         }
            //     });
            // },
        });
        return RenameDataset;
    });
