define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "apps/main/views/spreadsheet/choice-mixin",
    "text!../../templates/spreadsheet/field-item.html"
],
    function ($, _, Marionette, Handlebars, ChoiceMixin, FieldItemTemplate) {
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
            events: function () {
                return ChoiceMixin.events;
            },
            data_type_error: null,
            col_alias_error: null,
            templateHelpers: function () {
                const extras = this.model.get('extras') || {};
                var helpers = {
                    col_alias_error: this.col_alias_error,
                    data_type_error: this.data_type_error,
                    choices: extras.choices
                };
                return helpers;
            },

            onRender: function () {
                //make choices re-orderable:
                if (this.model.get('data_type') === 'choice') {
                    this.makeChoicesSortable();
                }
            },

            _validateColAlias: function () {
                const col_alias = this.$el.find('#col_alias').val();
                if (col_alias.length > 0) {
                    this.model.set('col_alias', col_alias);
                } else {
                    this.col_alias_error = "A valid column name is required";
                    this.render();
                    return false;
                }
                return true;
            },

            _clearErrorMessages: function () {
                this.data_type_error = null;
                this.col_alias_error = null;
            },

            commitData: function () {
                this._clearErrorMessages();
                let isValid = this._validateColAlias();
                if (isValid && this.model.get('data_type') === 'choice') {
                    this.setChoices();
                    isValid = isValid && this._validateChoices();
                }
                return isValid;
            },

            saveField: function () {
                const isValid = this.commitData();
                if (!isValid) {
                    return;
                }
                this.model.save(null, {
                    dataType:"text",
                    success: (model, response) => {
                        if (typeof(response) === 'string') {
                            response = JSON.parse(response);
                        }
                        console.log(response);
                        this.model.set('col_name', response.col_name);
                        this.model.set('extras', response.extras);
                        this.reloadDataset();
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
            reloadDataset: function () {
                /*
                 * This method synchronizes the field rename with any
                 * dependent models in the dataManager:
                 *   1. Re-queries the dataset (to refresh column headings)
                 *   2. If necessary, requeries the layer
                 *     (to update the symbol rules and group_by attribute)
                 */
                this.app.dataManager.reloadDatasetFromServer(
                    this.dataset,
                    this.reloadDependentLayers.bind(this)
                );
                // this.dataset.fetch({
                //     success: this.reloadDependentLayers.bind(this)
                // });
            },
            reloadDependentLayers: function () {
                // if the current field no longer exists and there's a
                // field dependency, then the active field has been
                // renamed...requires further coordination across
                // dependent layers:
                this.app.vent.trigger('field-updated');
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
            }
        });
        _.extend(RenameFieldView.prototype, ChoiceMixin);
        return RenameFieldView;

    });
