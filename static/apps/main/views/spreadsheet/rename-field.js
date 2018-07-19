define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "text!../../templates/spreadsheet/field-item.html"
],
    function ($, _, Marionette, Handlebars, FieldItemTemplate) {
        'use strict';
        /**
         * model --> Field
         * layer --> current layer (dataset accessible from layer)
         */
        var RenameFieldView = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(FieldItemTemplate);
            },
            error: null,
            templateHelpers: function () {
                var helpers = {
                    error: this.error
                };
                return helpers;
            },

            saveField: function() {
                this.error = null;
                const col_alias = this.$el.find('#col_alias').val();
                if (col_alias.length > 0) {
                    this.model.set('col_alias', col_alias);
                } else {
                    this.error = "A valid column name is required";
                }
                if (this.error) {
                    this.render();
                    return;
                }
                this.model.save(null, {
                    dataType:"text",
                    success: (model, response) => {
                        if (typeof(response) === 'string') {
                            response = JSON.parse(response);
                        }
                        this.model.set('col_name', response.col_name);
                        this.reloadDataset();
                        this.app.vent.trigger('field-updated');
                        this.sourceModal.hide();
                    },
                    error: (model, response) => {
                        var messages = response.responseText;
                        if (messages.slug && messages.slug.length > 0) {
                            this.slugError = messages.slug[0];
                        }
                        this.updateModal(response);
                    }
                });

            },
            reloadDataset: function () {
                /*
                 * This method synchronizes the field rename with any
                 * dependent models in the dataManager:
                 *   1. Re-queries the dataset (to refresh column headings)
                 *   2. If necessary, requeries the layer
                 *     (to update the symbol rules and group_by attribute)
                 */
                this.dataset.fetch({
                    success: this.reloadDependentLayers.bind(this)
                });
            },
            reloadDependentLayers: function () {
                // if the current field no longer exists and there's a
                // field dependency, then the active field has been
                // renamed...requires further coordination across
                // dependent layers:
                const layers = this.dataset.getDependentLayers(this.app.dataManager);
                layers.forEach(layer => {
                    if (layer.hasFieldDependency() && !layer.getGroupByField(this.app.dataManager)) {
                        layer.refreshFromServer();
                    }
                });
            },
            onShow: function () {
                setTimeout(() => {
                    this.$el.find('#col_alias').focus().select();
                }, 50);
            },

            updateModal: function (errorMessage) {
                if (errorMessage.status == '400') {
                    var messages = JSON.parse(errorMessage.responseText);
                    this.slugError = messages.slug[0];
                    this.generalError = null;
                } else {
                    this.generalError = "Save Unsuccessful. Unspecified Server Error. Consider changing layer title";
                    this.slugError = null;
                }
                this.render();
            }
        });
        return RenameFieldView;

    });
