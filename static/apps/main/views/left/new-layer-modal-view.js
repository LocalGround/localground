define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "models/layer",
    "text!../../templates/left/new-layer-modal.html"],
    function ($, _, Marionette, Handlebars, Layer, NewLayerModalTemplate) {
        'use strict';

        var NewLayer = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.listenTo(this.app.vent, "send-modal-error", this.updateModal);
                this.template = Handlebars.compile(NewLayerModalTemplate);
            },

            events: {
                "change #new-map-name" : "generateSlug",
                "click #layer-new-dataset": "toggleCheckboxes",
                "click #layer-existing-datasets": "toggleCheckboxes"
            },
            toggleCheckboxes: function (e) {
                console.log('TOGLLE');
                var $cb = this.$el.find('#dataset-list');
                if (e.target.id === 'layer-new-dataset') {
                    $cb.attr("disabled", "disabled");
                } else {
                    $cb.removeAttr("disabled");
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

            saveLayer: function() {
                console.log('new layer modal, save!', this);
                const layer_title = this.$el.find('#layer-title').val();
                const data_source = this.$el.find('#dataset-list').val();
                const random_color = "#000000".replace(/0/g, function(){
                    return (~~(Math.random()*16)).toString(16);
                });
                let that = this;
                console.log(layer_title, data_source);
                let layer = new Layer({
                    map_id: this.app.selectedMapModel.id,
                    data_source: data_source,
                    group_by: "basic",
                    symbols: [{
                        "fillColor": random_color,
                        "width": 20,
                        "rule": "*",
                        "title": layer_title,
                        "fillOpacity": 1,
                        "width": 20,
                        "strokeColor": "#ffffff",
                        "strokeWeight": 1,
                        "strokeOpacity": 1,
                        "shape": "circle"
                    }],
                    metadata: {
                        buckets: 4,
                        paletteId: 0,
                        fillOpacity: 1,
                        width: 20,
                        fillColor: random_color,
                        strokeColor: "#ffffff",
                        strokeWeight: 1,
                        strokeOpacity: 1,
                        shape: "circle"
                    },
                    title: layer_title
                });
                let layers = this.app.selectedMapModel.get('layers');
                
                layer.save(null, {
                    dataType:"text",
                    success: function() {
                        console.log('layer success');
                        layers.add(layer);
                        that.app.vent.trigger('close-modal');
                    },          
                    error: function (model, response) {
                        console.log('layer error');
                        var messages = JSON.parse(response.responseText);
                        if (messages.slug && messages.slug.length > 0) {
                            that.slugError = messages.slug[0];
                        }
                        that.updateModal(that.slugError);
                    }
                });
                
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
        return NewLayer;

    }
);
