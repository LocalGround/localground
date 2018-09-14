define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "text!./new-map-modal.html"],
    function ($, _, Marionette, Handlebars, CreateMapFormTemplate) {
        'use strict';

        var CreateMapForm = Marionette.ItemView.extend({
            errors: {},
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(CreateMapFormTemplate);
                console.log('new map modal view');
                const datasets = this.app.dataManager.getDatasets();
                this.formData = {
                    name: this.getDefaultMapTitle(),
                    caption: '',
                    create: '',
                    existing: 'checked',
                    datasets: datasets.map(dataset => {
                        dataset.checked = 'checked';
                        return dataset;
                    })
                };
            },

            getDefaultMapTitle: function () {
                const maps = this.app.dataManager.getMaps();
                try {
                    const maxNumber = maps.map(map => {
                        return map.get('name');
                    }).filter(name => {
                        return /Untitled\sMap\s*\d*/g.test(name);
                    }).map(name => {
                        const a = /\d+/g.exec(name);
                        return (a && a.length > 0) ? parseInt(a[0]) : 0;
                    }).reduce((a, b) => {
                        return Math.max(a, b);
                    });
                    //console.log(maxNumber);
                    return 'Untitled Map ' + (maxNumber + 1);
                } catch (e) {
                    return 'Untitled Map'
                }
            },

            events: {
                "click #new-dataset": "toggleCheckboxes",
                "click #existing-datasets": "toggleCheckboxes"
            },

            toggleCheckboxes: function (e) {
                this.$el.find('#existing-datasets').parent().removeClass('error');
                var $cb = this.$el.find('.checkbox-list, .checkbox-list *');
                if (e.target.id === 'new-dataset') {
                    $cb.attr("disabled", "disabled");
                } else {
                    $cb.removeAttr("disabled");
                }
            },
            templateHelpers: function () {
                this.formData.errors = this.errors;
                return this.formData;
            },

            setName: function () {
                this.formData.name = this.$el.find("#map-name").val();
                if (this.formData.name.length > 0) {
                    this.model.set("name", this.formData.name);
                } else {
                    this.errors.name = "A valid map name is required";
                }
            },
            setCaption: function () {
                this.formData.caption = this.$el.find("#map-caption").val();
                this.model.set("caption", this.formData.caption);
            },
            setDatasets: function () {
                this.formData.create = this.$el.find('#new-dataset').prop('checked') ? "checked" : "";
                this.formData.existing = this.formData.create ? "" : "checked";

                // validate dataset selection: either create one or select existing one
                if (this.formData.create === 'checked') {
                    this.model.set("create_new_dataset", true);
                    return;
                }

                const datasets = []
                this.formData.datasets.forEach(dataset => {
                    const isSelected = this.$el.find('#' + dataset.formID).prop('checked');
                    dataset.checked = isSelected ? 'checked': '';
                    if (isSelected) {
                        datasets.push(parseInt(dataset.formID));
                    }
                });

                // validate that at least one datasource was selected:
                if (datasets.length === 0) {
                    this.errors.datasets = 'Please select at least one data source (or indicate that you want to create a new one).';
                    return;
                }
                this.model.set("datasets", JSON.stringify(datasets));
            },

            applyChanges: function () {
                this.errors = {};
                this.setName();
                this.setCaption();
                this.setDatasets();
            },

            onShow: function () {
                setTimeout(() => {
                    this.$el.find('#map-name').focus().select();
                }, 50);
            },

            saveMap: function () {
                this.applyChanges()
                if (!_.isEmpty(this.errors)) {
                    this.render();
                    return;
                }
                this.model.save(null, {
                    success: this.displayMap.bind(this),
                    failure: this.handleServerError.bind(this)
                });
            },
            displayMap: function () {
                this.app.popover.hide();
                this.app.dataManager.addMap(this.model);
                this.app.vent.trigger('close-modal');
                if (this.app.router) {
                    this.app.router.navigate('//' + this.model.id);
                }
            },

            handleServerError: function (errorMessage) {
                alert('there was an error');
            }
        });
        return CreateMapForm;

    }
);
