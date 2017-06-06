define(["models/base",
        "underscore",
	    "models/association"],
    function (Base, _, Association) {
        "use strict";
        /**
         * A Backbone Model class for the Project datatype.
         * @class Project
         * @see <a href="//localground.org/api/0/projects/">//localground.org/api/0/projects/</a>
         */
        var Record = Base.extend({
            /*
             TODO: strip out IDs from JSON, and stash JSON elsewhere.
             */
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
                /*
                 Terrible hack to accommodate the Django REST Framework. Before the
                 browser issues a POST, PUT, or PATCH request, it first issues an
                 OPTIONS request to ensure that the request is legal. For some reason,
                 the Local Ground produces an error for this OPTIONS request if a
                 '/.json' footer isn't attached to the end. Hence this function overrides
                 the based url() function in backbone
                 */
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
                    attachmentType: model.getKey()
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
                    j;
                console.log( this.get("fields"));
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
                                val: extras[j].value,
                                label: extras[j].name
                            });
                        }
                        fields[name] = { type: 'Select', title: title, options: options };
                        break;
                    case "choice":
                        options = [];
                        extras = JSON.parse(field.extras);
                        for (j = 0; j < extras.length; j++) {
                            options.push(extras[j].name);
                        }
                        fields[name] = { type: 'Select', title: title, options: options };
                        break;
                    case "date-time":
                        fields[name] = {
                            title: title,
                            type: 'DateTimePicker'
                        };
                        break;
                    case "boolean":
                        fields[name] = { type: 'Checkbox', title: title };
                        break;
                    case "integer":
                    case "decimal":
                        fields[name] = { type: 'Number', title: title };
                        break;
                    default:
                        fields[name] = { type: 'TextArea', title: title };
                    }
                }
                fields.children = { type: 'MediaEditor', title: 'children' };
                return fields;
            }

        });
        return Record;
    });
