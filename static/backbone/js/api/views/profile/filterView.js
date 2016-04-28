define(["underscore",
        "marionette",
        "text!../../../templates/profile/filter.html",
        "form",
        "bootstrap-form-templates"
    ],
    function (_, Marionette, FilterTemplate, Form) {
        'use strict';
        var FilterView = Marionette.ItemView.extend({
            ENTER_KEY: 13,
            events: {
                "click #submitSearch": "applyFilter",
                "click #clearSearch": "clearFilter",
                "click .dropdown-menu": "clickFilterArea"
            },
            clickFilterArea: function (e) {
                // Stops the filter menu from closing
                e.stopPropagation();
            },
            initialize: function (opts) {
                console.log(opts);
                _.extend(this, opts);
                // additional initialization logic goes here...
                this.options = opts;
                this.listenTo(this.app.vent, "filter-form-updated", this.renderFilterForm);
            },
            renderFilterForm: function (schema) {
                this.Form = Form.extend({
                    schema: schema
                });
                this.form = new this.Form({
                    model: this.model
                }).render();
                this.$el.find("#filter-menu").empty();
                this.$el.find("#filter-menu").append(this.form.$el);
            },
            template: function () {
                return _.template(FilterTemplate);
            },
            applyFilter: function (e) {
                var params = this.createParameterList();

                if (params.length > 0) {
                    this.app.vent.trigger("apply-filter", params);
                } else {
                    this.app.vent.trigger("clear-filter");
                }
                if (e) {
                    console.log("prevent default");
                    e.preventDefault();
                }
            },
            clearFilter: function (e) {
                this.$el.find('#filterDiv').find('input:text').val('');
                this.app.vent.trigger("clear-filter");
            },
            createParameterList: function(){
              var params = [];
              this.$el.find('#filterDiv :input:text').each(function(){
                   var input = $(this); // This is the jquery object of the input, do what you will
                   var textInputValue = input.val();

                   if (textInputValue) {
                    params.push({ name : input.attr('name'), value : textInputValue, operation: input.attr("data-operator") });
                   }
                  }
              );
              return params;
            }

        });
        return FilterView;
    });
