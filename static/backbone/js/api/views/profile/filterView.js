define(["underscore",
        "marionette",
        "text!../../../templates/profile/filter.html"
    ],
    function (_, Marionette, FilterTemplate) {
        'use strict';
        var FilterView = Marionette.ItemView.extend({
            ENTER_KEY: 13,
            events: {
                "keyup #search-term": "handleKeypress",
                "click #submitSearch": "applyFilter"

            },
            initialize: function (opts) {
                _.extend(this, opts);
                // additional initialization logic goes here...
                this.options = opts;
            },

            template: function () {
                return _.template(FilterTemplate);
            },

            handleKeypress: function (e) {
                if (e.keyCode === 13) {
                    this.applyFilter();
                }
            },

            applyFilter: function (e) {
                var term = this.$el.find('#search-term').val();
                if (term.length > 0) {
                    this.app.vent.trigger("apply-filter", term);
                } else {
                    this.app.vent.trigger("clear-filter", term);
                }
                if (e) {
                    e.preventDefault();
                }
            }

        });
        return FilterView;
    });
