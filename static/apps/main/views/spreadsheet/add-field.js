define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "models/field",
    "text!../../templates/spreadsheet/add-field.html"
],
    function ($, _, Marionette, Handlebars, Field, AddFieldTemplate) {
        'use strict';
        /**
         * model --> Field
         * layer --> current layer (dataset accessible from layer)
         */
        var AddFieldView = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                console.log(this.dataset.formID);
                this.model = new Field(
                    {ordering: this.ordering},
                    {id: this.dataset.formID}
                );
                this.template = Handlebars.compile(AddFieldTemplate);
            },
            error: null,
            templateHelpers: function () {
                var helpers = {
                    col_type_error: this.col_type_error,
                    col_alias_error: this.col_alias_error
                };
                return helpers;
            },
            _clearErrorMessages: function () {
                this.col_type_error = null;
                this.col_alias_error = null;
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
            _validateColType: function () {
                const col_type = this.$el.find('#col_type').val();
                if (['a', 'b', 'c'].includes(col_type)) {
                    this.model.set('col_type', col_type);
                } else {
                    this.col_type_error = "A valid column type is required";
                    this.render();
                    return false;
                }
                return true;
            },

            saveField: function() {
                this._clearErrorMessages();
                if (!this._validateColAlias() || !this._validateColType()) {
                    console.log(errors);
                    return;
                }
                this.app.dataManager.addFieldToCollection(
                    this.dataset,
                    this.model,
                    () => { console.log('callback'); }
                );
                // this.model.save(null, {
                //     dataType:"text",
                //     success: (model, response) => {
                //         if (typeof(response) === 'string') {
                //             response = JSON.parse(response);
                //         }
                //         this.model.set('col_name', response.col_name);
                //         this.reloadDataset();
                //         this.app.vent.trigger('field-updated');
                //         this.sourceModal.hide();
                //     },
                //     error: (model, response) => {
                //         try {
                //             response = JSON.parse(response.responseText);
                //             this.app.vent.trigger('error-message', response.detail);
                //         } catch (e) {
                //             console.error(e);
                //             this.app.vent.trigger('error-message', response.responseText);
                //         }
                //     }
                // });

            }
            // reloadDataset: function () {
            //     /*
            //      * This method synchronizes the field rename with any
            //      * dependent models in the dataManager:
            //      *   1. Re-queries the dataset (to refresh column headings)
            //      *   2. If necessary, requeries the layer
            //      *     (to update the symbol rules and group_by attribute)
            //      */
            //     this.dataset.fetch({
            //         success: this.reloadDependentLayers.bind(this)
            //     });
            // },
            // reloadDependentLayers: function () {
            //     // if the current field no longer exists and there's a
            //     // field dependency, then the active field has been
            //     // renamed...requires further coordination across
            //     // dependent layers:
            //     const layers = this.dataset.getDependentLayers(this.app.dataManager);
            //     layers.forEach(layer => {
            //         if (layer.hasFieldDependency() && !layer.getGroupByField(this.app.dataManager)) {
            //             layer.refreshFromServer();
            //         }
            //     });
            // },
            // onShow: function () {
            //     setTimeout(() => {
            //         this.$el.find('#col_alias').focus().select();
            //     }, 50);
            // }
        });
        return AddFieldView;

    });
