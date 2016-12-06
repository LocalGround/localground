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
      url: '/api/0/forms/',

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
          field.set("name", name);
          field.set("field", fieldType);
          field.set("authority", 3);
          field.save(null, {
              success: function () {
                  that.getFields();
              }
          });
      }

    });
    return Form;
});
