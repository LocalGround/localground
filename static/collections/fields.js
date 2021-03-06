define(["models/field", "collections/basePageable"], function (Field, BasePageable) {
    "use strict";
    /*
    This is a rough draft of the fields file
    It is expected to be revised since it's templated
    after projectUsers in structure.
    */
    var Fields = BasePageable.extend({
        model: Field,
        name: 'Fields',
        baseURL: null,
        form: null,
        sort_key: 'ordering',
        url: function () {
            if (this.baseURL) {
                return this.baseURL;
            }
            return '/api/0/datasets/' + this.form.get("id") + '/fields/';
        },
        comparator: function (item) {
            return item.get(this.sort_key);
        },
        getModelByAttribute: function (key, val) {
            return this.find(function (model) { return model.get(key) === val; });
        },
        initialize: function (recs, opts) {
            if (opts.baseURL) {
                this.baseURL = opts.baseURL;
            } else if (opts.id) {
                this.baseURL = '/api/0/datasets/' + opts.id + '/fields/';
            } else if (opts.form) {
                this.form = opts.form;
            } else {
                alert("The Fields collection requires a url parameter upon initialization");
                return;
            }
            // This had to be made dynamic because there are different fields
            // for each form
            BasePageable.prototype.initialize.apply(this, arguments);
        }
    });
    return Fields;
});
