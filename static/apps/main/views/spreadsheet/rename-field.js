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
                    this.error = "A valid field name is required";
                }
                if (this.error) {
                    this.render();
                    return;
                }
                this.model.save(null, {
                    dataType:"text",
                    success: (model, response) => {
                        response = JSON.parse(response);
                        this.model.set('col_name', response.col_name);
                        this.syncDependencies();
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
            syncDependencies: function () {
                /*
                 * This method synchronizes the field rename with any
                 * dependent models in the dataManager:
                 *   1. Re-queries the dataset (to refresh column headings)
                 *   2. If necessary, requeries the layer
                 *     (to update the symbol rules and group_by attribute)
                 */
                const dataset = this.layer.getDataset(this.app.dataManager);
                const groupByField = this.layer.getGroupByField(this.app.dataManager);
                // re-query the dataset from the server
                // (because the column headers no longer match):
                dataset.fetch({
                    success: () => {
                        // if the current field no longer exists, then the active
                        // field has been renamed...requires further coordination
                        if (!groupByField && !this.layer.isUniform() && !this.layer.isIndividual()) {
                            this.layer.fetch().done(() => {
                                // using 'done' b/c success doesn't seem to be working
                                // for the Layer model.
                                // Resetting symbols:
                                this.layer.setSymbols(this.layer.get('symbols_json'));
                            });
                        }
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
