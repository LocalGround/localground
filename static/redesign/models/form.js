define(
  ["underscore", "models/base", "models/field", "collections/fields"],
  function (_, Base, Field, Fields) {
    "use strict";
    var Form = Base.extend({
      defaults: _.extend({}, Base.prototype.defaults, {
          isActive: false,
          isVisible: false,
          checked: false
      }),
      urlRoot: '/api/0/forms/',
      initialize: function (data, opts) {
          if (this.get("id")) {
              this.fields = new Fields(null, { id: this.get("id") });
          }
          Base.prototype.initialize.apply(this, arguments);
      },

      getFields: function(){
        this.fields.fetch({ reset: true });
      },

      // This is a rough draft of the following function
      // that is expected to change throughout revision
      createField: function (name, fieldType) {
          var field = new Field(null, { id: this.get("id") }),
              that = this;
          field.set("col_alias", name);
          field.set("data_type", fieldType);
          field.save(null, {
              success: function () {
                  that.getFields();
              },
              error: function(){
                  console.error("Field is not saved");
              }
          });
      },
        getFieldByName: function (col_alias) {
            console.log("fieldname", col_alias);
            var i, f, u;
            for (i = 0; i < this.fields.length; i++) {
                f = this.fields.at(i);
                if (f.get("col_alias") === col_alias) {
                    return f;
                }
            }
            return null;
        }
    });
    return Form;
});
