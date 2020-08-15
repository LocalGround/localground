define(["models/base",
        "underscore",
	    "models/association",
	    "collections/audio"],
    function (Base, _, Association, AudioCollection) {
        "use strict";

        var Record = Base.extend({
            defaults: _.extend({}, Base.prototype.defaults, {
                name: ""
            }),
            viewSchema: null,
            initialize: function (data, opts) {
                opts = opts || {};
                if (opts.urlRoot) {
                    this.urlRoot = opts.urlRoot;
                }
                console.log(this.url());
                Base.prototype.initialize.apply(this, arguments);
                if (opts) {
                    this.viewSchema = this._generateSchema(opts.updateMetadata, false);
                }
            },

            toTemplateJSON: function () {
                var json = Base.prototype.toTemplateJSON.apply(this, arguments),
                    key;
                json.list = [];
                for (key in this.viewSchema) {
                    if (this.hiddenFields.indexOf(key) === -1 && !/(^\w*_detail$)/.test(key)) {
                        json.list.push({
                            key: this.viewSchema[key].title || key,
                            value: this.get(key)
                        });
                    }
                }
                return json;
            },

            attach: function (model, callbackSuccess, callbackError) {
                var association = new Association({
                    model: this,
                    attachmentType: model.getDataTypePlural()
                });
                association.save({ object_id: model.id}, {
                    success: callbackSuccess,
                    error: callbackError
                });
            },

            getPhotoVideoCollection: function (dataManager) {
                const mediaList = this.get("attached_photos_videos") || [];
                const models = mediaList.map(item => dataManager.getCollection(item.overlay_type + 's').get(item.id))
                    .filter(item => (item != null));
                return new Backbone.Collection(models);
            },

            getAudioCollection: function (dataManager) {
                const audioList = this.get("attached_audio") || [];
                const models = audioList.map(item => dataManager.getAudio(item.id))
                    .filter(model => model != null);
                return new AudioCollection(models, {
                    projectID: this.get('project_id')
                });
            },
            getPhotos: function (dataManager) {
                return this.getPhotoVideoCollection(dataManager).filter(
                    model => model.get('overlay_type') === 'photo'
                );
            },
            getAudio: function (dataManager) {
                return this.getAudioCollection(dataManager);
            },
            getVideos: function (dataManager) {
                return this.getPhotoVideoCollection(dataManager).filter(
                    model => model.get('overlay_type') === 'video'
                );
            },
            getFeaturedImage: function (dataManager) {
                const extras = this.get("extras") || {}
                if (extras.featured_image) {
                    const photo = dataManager.getPhoto(extras.featured_image)
                    if (photo) {
                        return photo.toJSON();
                    }
                }
            },
            detach: function (attachmentType, attachmentID, callback) {
                var association = new Association({
                    model: this,
                    attachmentType: attachmentType,
                    attachmentID: attachmentID
                });
                association.destroy({success: callback});
            },
            parseExtras: function (extras) {
                if (typeof extras === 'string') {
                    try {
                        return JSON.parse(extras);
                    } catch(e) {
                        console.error(extras, 'not parsed');
                        return {};
                    }
                } else if (typeof extras !== 'object') {
                    return {};
                } else if (extras === null) {
                    return {};
                }
                return extras;
            },
            getFormSchema: function () {
                const schema = {};
                let options;
                this.get("fields").forEach(field => {
                    const type = field.data_type.toLowerCase();
                    const name = field.col_name;
                    const title = field.col_alias;
                    field.val = this.get(field.col_name);
                    field.extras = this.parseExtras(field.extras);
                    const choices = field.extras.choices || [];
                    switch (type) {
                        case "rating":
                            options = choices.map(choice => {
                                return {
                                    label: choice.name,
                                    val: parseInt(choice.value, 10)
                                };
                            });
                            schema[name] = { type: 'Rating', title: title, options: options };
                            break;
                        case "choice":
                            options = choices.map(choice => choice.name);
                            schema[name] = {
                                type: 'Select',
                                title: title,
                                options: options,
                                listType: 'Number'
                            };
                            break;
                        case "date-time":
                            schema[name] = {
                                title: title,
                                type: 'DateTimePicker'
                            };
                            break;
                        case "boolean":
                            schema[name] = {
                                type: 'BooleanChoice',
                                title: title,
                                options: [
                                    {'label' : 'No value', 'val': ''},
                                    {'label' : 'Yes', 'val': 'true'},
                                    {'label' : 'No', 'val': 'false'}
                                ]
                            };
                            break;
                            // schema[name] = { type: 'Checkbox', title: title };
                            // break;
                        case "integer":
                        case "decimal":
                            schema[name] = { type: 'Number', title: title };
                            break;
                        default:
                            schema[name] = { type: 'TextArea', title: title };
                    }
                });
                schema.children = { type: 'MediaEditor', title: 'children' };
                return schema;
            }

        });
        return Record;
    });
