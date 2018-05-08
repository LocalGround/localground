define(["models/base",
        "underscore",
	    "models/association"],
    function (Base, _, Association) {
        "use strict";

        var Record = Base.extend({
            defaults: _.extend({}, Base.prototype.defaults, {
                name: ""
            }),
            viewSchema: null,
            initialize: function (data, opts) {
                Base.prototype.initialize.apply(this, arguments);
                if (opts) {
                    this.viewSchema = this._generateSchema(opts.updateMetadata, false);
                }
            },
            url: function () {

                var base =
                    _.result(this, 'urlRoot') ||
                    _.result(this.collection, 'url') || urlError(),
                    url;
                if (this.isNew()) {
                    return base + '.json';
                }
                url = base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id) + '/.json';
                return url;
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

            attach: function (model, order, callbackSuccess, callbackError) {
                var association = new Association({
                    model: this,
                    attachmentType: model.getDataTypePlural()
                });
                association.save({ object_id: model.id, ordering: order }, {
                    success: callbackSuccess,
                    error: callbackError
                });
            },

            detach: function (attachmentType, attachmentID, callback) {
                var association = new Association({
                    model: this,
                    attachmentType: attachmentType,
                    attachmentID: attachmentID
                });
                association.destroy({success: callback});
            },
            getFormSchema: function () {
                var fields = this.get("fields"),
                    field,
                    type,
                    name,
                    title,
                    i,
                    options,
                    extras,
                    j,
                    schema = {};
                for (i = 0; i < this.get("fields").length; i++) {
                    field = this.get("fields")[i];
                    field.val = this.get(field.col_name);
                    type = field.data_type.toLowerCase();
                    name = field.col_name;
                    title = field.col_alias;
                    switch (type) {
                    case "rating":
                        options = [];
                        extras = JSON.parse(field.extras);
                        for (j = 0; j < extras.length; j++) {
                            options.push({
                                val: parseInt(extras[j].value, 10),
                                label: extras[j].name
                            });
                        }
                        schema[name] = { type: 'Rating', title: title, options: options };
                        break;
                    case "choice":
                        options = [];
                        extras = JSON.parse(field.extras);
                        for (j = 0; j < extras.length; j++) {
                            options.push(extras[j].name);
                        }
                        schema[name] = { type: 'Select', title: title, options: options, listType: 'Number' };
                        break;
                    case "date-time":
                        schema[name] = {
                            title: title,
                            type: 'DateTimePicker'
                        };
                        break;
                    case "boolean":
                        schema[name] = { type: 'Checkbox', title: title };
                        break;
                    case "integer":
                    case "decimal":
                        schema[name] = { type: 'Number', title: title };
                        break;
                    default:
                        schema[name] = { type: 'TextArea', title: title };
                    }
                }
                schema.children = { type: 'MediaEditor', title: 'children' };
                return schema;
            }

        });
        return Record;
    });
