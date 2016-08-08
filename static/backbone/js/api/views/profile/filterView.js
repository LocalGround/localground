define(["jquery",
        "underscore",
        "marionette",
        "text!../../../templates/profile/filter1.html",
        "form",
        "bootstrap-form-templates"
    ],
    function ($, _, Marionette, FilterTemplate, Form) {
        'use strict';
        var FilterView = Marionette.ItemView.extend({
            ENTER_KEY: 13,
            searchMode: "basic",
            events: {
                "click #submitSearch": "applyFilter",
                "click .advanced-search-mode": "switchToAdvancedMode",
                "click .basic-search-mode": "switchToBasicMode",
                "click .code-search-mode": "switchToCodeMode",
                "focusout input": "generateQuery",
                "click #basicSearch" : "basicSearch",
                "click #codeSearch" : "codeSearch",
                "click #advancedSearch" : "advancedSearch"
                //"click #clearSearch": "clearFilter",
                //"click .dropdown-menu": "clickFilterArea",
                //"click #filterDropdown" : "filterClicked",
            },
            initialize: function (opts) {
                //console.log(opts);
                _.extend(this, opts);
                // additional initialization logic goes here...
                this.options = opts;
            },
            render: function () {
                this.$el.html(_.template(FilterTemplate, {
                    search_mode: this.searchMode,
                    sql: this.sql
                }));
                return this.$el;
            },
            switchToAdvancedMode: function () {
                this.searchMode = "advanced";
                this.render();
            },
            switchToBasicMode: function () {
                this.searchMode = "basic";
                this.render();
            },
            switchToCodeMode: function () {
                this.searchMode = "code";
                this.render();
            },
            template: function () {
                return _.template(FilterTemplate);
            },
            basicSearch: function (e) {
                //console.log(this.$el.find("#searchInput").val());
                //var params = this.$el.find('#filterDiv').find('textarea').val();
                var searchTerm = this.$el.find('#searchInput').val(),
                    fieldNames = ['name', 'attribution', 'tags', 'file_name_orig', 'caption', 'owner'],
                    params = [],
                    i = 0;
                for (i = 0; i < fieldNames.length; i++) {
                    params.push({
                        name: fieldNames[i],
                        operation: 'LIKE',
                        value: searchTerm
                    });
                }
                this.sql = this.createSQLQuery(params, 'Or');

                if (params.length > 0) {
                    this.app.vent.trigger("apply-filter", this.sql);
                } else {
                    this.app.vent.trigger("clear-filter");
                }
                if (e) {
                    console.log("prevent default");
                    e.preventDefault();
                }

            },
            codeSearch: function (e) {
                //console.log(this.$el.find("#searchInput").val());
                //var params = this.$el.find('#filterDiv').find('textarea').val();
                this.sql = this.$el.find('#codeInput').val();
                console.log(this.sql);

                if (this.sql.length > 0) {
                    this.app.vent.trigger("apply-filter", this.sql);
                } else {
                    this.app.vent.trigger("clear-filter");
                }
                if (e) {
                    console.log("prevent default");
                    e.preventDefault();
                }

            },
            advancedSearch: function (e) {
                var fields = this.$el.find('.search-field'),
                    values = this.$el.find('.search-value'),
                    conjunctions = this.$el.find('.search-conjunction'),
                    i,
                    params = [];
                for (i = 0; i < fields.length; i++) {
                    params.push({
                        name: $(fields[i]).val(),
                        operation: 'LIKE',
                        value: $(values[i]).val(),
                        conjunction: (i > 0) ? $(conjunctions[i - 1]).val() : undefined
                    });
                }
                this.sql = this.createSQLQuery(params);
                //console.log(this.sql);
                if (this.sql.length > 0) {
                    this.app.vent.trigger("apply-filter", this.sql);
                } else {
                    this.app.vent.trigger("clear-filter");
                }
                if (e) {
                    console.log("prevent default");
                    e.preventDefault();
                }

            },
            advancedQuery: function(field, input, parameter){
              var fieldNames;
                if (field == 'any')
                {
                    fieldNames = ['name', 'attribution', 'tags', 'file_name_orig', 'caption', 'owner'];
                }
                else
                {
                    fieldNames = [field];
                }
                //console.log(this.$el.find('#searchField').val());
                //console.log(fieldNames);
                var searchTerm = input,
                    //fieldNames = ['name', 'attribution', 'tags', 'file_name_orig', 'caption', 'owner'],
                    //fieldNames = [this.$el.find('#searchField').val()],
                    params = [],
                    i = 0;
                for (i = 0; i < fieldNames.length; i++) {
                    params.push({
                        name: fieldNames[i],
                        operation: 'LIKE',
                        value: searchTerm
                    });
                }
                this.sql = this.createSQLQuery(params, parameter);
            },
            generateQuery: function(e){
              var params = this.createParameterList();
              if (params.length > 0) {
                var query = this.createSQLQuery(params);
                this.$el.find('#filterDiv').find('textarea').val(query);
              }
              else {
                this.$el.find('#filterDiv').find('textarea').val('');
              }
            },
            applyFilter: function (e) {
                var params = this.$el.find('#filterDiv').find('textarea').val();
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

            // clearFilter: function (e) {
            //     this.$el.find('#filterDiv').find('input:text').val('');
            //     this.$el.find('#filterDiv').find('input').val('');
            //     this.$el.find('#filterDiv').find('textarea').val('');
            //     this.app.vent.trigger("clear-filter");
            // },
            createParameterList: function () {
              var params = [];
              this.$el.find('#filterDiv :input:text, :input[type=number]').each(function(){
                   var input = $(this); // This is the jquery object of the input, do what you will
                   var textInputValue = input.val();

                   if (textInputValue) {
                    params.push({ name : input.attr('name'), value : textInputValue, operation: input.attr("data-operator") });
                   }
                  }
              );
              return params;
            },
            createSQLQuery: function (params) {
                var query = "WHERE ";
                _.each(params, function (parameter, index) {
                    if (index > 0) {
                        query += parameter.conjunction ? " " + parameter.conjunction + " " : " OR ";
                    }
                    if (parameter.operation == "=") {
                        query += parameter.name + " = " + parameter.value;
                    } else {
                        query += parameter.name + " LIKE '%" + parameter.value + "%'";
                    }
                });
                return query;
            }

            // filterClicked: function (e) {
            //     e.stopPropagation();
            //     $('#filter-dropdown-menu').toggle();
            // },
            // clickFilterArea: function (e) {
            //     // Stops the filter menu from closing
            //     e.stopPropagation();
            // },

        });
        return FilterView;
    });
