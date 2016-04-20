define(["underscore",
        "marionette",
        "text!../../../templates/profile/filter.html"
    ],
    function (_, Marionette, FilterTemplate) {
        'use strict';
        var FilterView = Marionette.ItemView.extend({
            ENTER_KEY: 13,
            events: {
                "click #submitSearch": "applyFilter",
                "click #clearSearch": "clearFilter",
                "click #filter-menu": "clickFilterArea"
            },
            clickFilterArea: function(e){
              // Stops the filter menu from closing
              e.stopPropagation();
            },
            initialize: function (opts) {
                _.extend(this, opts);
                // additional initialization logic goes here...
                this.options = opts;
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
