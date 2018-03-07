define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "text!../../templates/left/new-map-modal.html"],
    function ($, _, Marionette, Handlebars, NewMapModalTemplate) {
        'use strict';

        var NewMap = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.listenTo(this.app.vent, "send-modal-error", this.updateModal);
                this.template = Handlebars.compile(NewMapModalTemplate);
            },

            events: {
                "change #new-map-name" : "generateSlug",
                "click #new-dataset": "toggleCheckboxes",
                "click #existing-datasets": "toggleCheckboxes"
            },
            toggleCheckboxes: function (e) {
                var $cb = this.$el.find('.checkbox-list');
                if (e.target.id === 'new-dataset') {
                    $cb.hide();
                } else {
                    $cb.show();
                }
            },
            slugError: null,
            templateHelpers: function () {
                var name, slug, description;
                if (this.mode == 'editExistingMap') {
                    name = this.map.get('name');
                    slug = this.map.get('slug');
                    description = this.map.get('caption');
                }
                var datasets = [];
                this.app.dataManager.each(function (item) {
                    if (item.isSite) {
                        datasets.push({key: item.key, title: item.title});
                    }
                });
                var helpers = {
                    slugError: this.slugError,
                    generalError: this.generalError,
                    name: name,
                    slug: slug,
                    description: description,
                    datasets: datasets
                };
                return helpers;
            },

            saveMap: function () {
                console.log('new map modal, save!');
                console.log('mode: ', this.mode);
                var mapAttrs = {};
                mapAttrs.name = this.$el.find("#new-map-name").val();
                mapAttrs.slug = this.$el.find('#new-map-slug').val();
                mapAttrs.description = this.$el.find('#new-map-description').val();

                if (this.mode == 'editExistingMap') {
                    console.log('editExistingMap: ', this.mode);
                    this.map.set({
                        name: this.$el.find("#new-map-name").val(),
                        slug: this.$el.find("#new-map-slug").val(),
                        caption: this.$el.find("#new-map-description").val(),
                    });
                    this.app.vent.trigger("edit-map", this.map);
                } else if (this.mode == 'createNewMap') {
                    console.log('createNewMap: ', this.mode);
                    this.map.save(null, {
                        success: this.createLayers.bind(this)
                    })
                    //this.app.vent.trigger("create-new-map", mapAttrs);
                }
            },
            createLayers: function () {
                //TODO: replace
                var dataSources = ['records', 'form_1'];
                var layers = new Layers(null, {mapID: this.map.get("id")});
                var that = this;
                var dm = this.app.dataManager;
                this.map.set("layers", layers);

                // dataSources.forEach(function (dataSource) {
                //     var collection = dm.getCollection(dataSource);
                //     var layer = new Layer({
                //         map_id: that.map.id,
                //         data_source: dataSource,
                //         layer_type: "basic",
                //         filters: {},
                //         symbols: [{
                //             "fillColor": collection.fillColor,
                //             "width": 20,
                //             "rule": "*",
                //             "title": collection.getTitle()
                //         }],
                //         metadata: {
                //             buckets: 4,
                //             paletteId: 0,
                //             fillOpacity: 1,
                //             width: 20,
                //             fillColor: collection.fillColor,
                //             strokeColor: "#ffffff",
                //             strokeWeight: 1,
                //             strokeOpacity: 1,
                //             shape: "circle"
                //         },
                //         title: collection.getTitle()
                //     });
                //     layers.add(layer);
                //     layer.save(null, {
                //         success: console.log('layers saved successfully'),
                //         error: function (model, response){
                //             var messages = JSON.parse(response.responseText);
                //             console.log(messages);
                //         }
                //     });
                // }})
                //this.setActiveMap(this.map);
             //   this.render();
                this.app.router.navigate('//' + this.map.id);
            },

            generateSlug: function () {
                var name = this.$el.find('#new-map-name').val(),
                    slug = name.toLowerCase().replace(/\s+/g, "-");
                this.$el.find('#new-map-slug').val(slug);
            },

            updateModal: function (errorMessage) {
                if (errorMessage.status == '400') {
                    var messages = JSON.parse(errorMessage.responseText);
                    this.slugError = messages.slug[0];
                    this.generalError = null;
                } else {
                    this.generalError = "Save Unsuccessful. Unspecified Server Error. Consider changing Map Title or Friendly Url";
                    this.slugError = null;
                }
                this.render();
            }
        });
        return NewMap;

    }
);
