define(
  ["models/field", "collections/basePageable"],
  function (Field, BasePageable){
    "use-strict";
    /*
    This is a rough draft of the fields file
    It is expected to be revised since it's templated
    after projectUsers in structure.
    */
    var Fields = BasePageable.extend({
      model: Field,
      name: 'Fields',
      initialize: function (recs, opts) {
          if (opts.url) {
            this.url = opts.url;   
          } else if (opts.id) {
              this.url = '/api/0/forms/' + opts.id + '/fields/';
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

  }
);
