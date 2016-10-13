define(["models/base", "underscore"], function (Base, _) {
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
        
        save: function (key, val, options) {		
            return Backbone.Model.prototype.save.call(this, key, val, options);		
		}

    });
    return Record;
});
