define([
    "underscore",
    "jquery",
    "handlebars",
    "marionette",
    "models/form",
    "apps/gallery/views/create-form",
    "text!../templates/toolbar-dataview.html"
], function (_, $, Handlebars, Marionette, FormModel, CreateForm, ToolbarTemplate) {
    "use strict";
    var ToolbarDataView = Marionette.ItemView.extend({
        /*
        Because of the blinking, consider:
        http://stackoverflow.com/questions/10746706/attaching-backbone-js-views-to-existing-elements-vs-inserting-el-into-the-doms
        */
        events: {
            'click #toolbar-search': 'doSearch',
            'click #toolbar-clear': 'clearSearch',
            'change #media-type': 'changeDisplay',
            'click #add-data' : 'showCreateForm'
        },

        template: Handlebars.compile(ToolbarTemplate),

        templateHelpers: function () {
            return {
                mode: this.app.mode,
                dataType: this.app.dataType,
                screenType: this.app.screenType
            };
        },

        initialize: function (opts) {
            _.extend(this, opts);
            Marionette.ItemView.prototype.initialize.call(this);
            this.template = Handlebars.compile(ToolbarTemplate);
            // Trying to get the listener to be correct
            // I am not sure yet on how it properly works
            this.listenTo(this.app.vent, 'add-data', this.showCreateForm);
        },

        clearSearch: function (e) {
            this.app.vent.trigger("clear-search");
            e.preventDefault();
        },

        doSearch: function (e) {
            /*
             * NOTE
             *   - app.js is listening for the search-requested event
             *   - Please see localground/apps/site/api/tests/sql_parse_tests.py
             *     for samples of valid queries.
             */
            var term = this.$el.find("#searchTerm").val(),
                query = "name like %" + term +
                        "% OR caption like %" + term +
                        "% OR attribution like %" + term +
                        "% OR owner like %" + term +
                        "% OR tags contains (" + term + ")";
            this.app.vent.trigger("search-requested", query);
            e.preventDefault();
        },

        changeDisplay: function (e) {
            var dataType =  $(e.currentTarget).val();
            this.app.router.navigate('//' + dataType, { trigger: true });
        },

        showCreateForm: function () {
            var createForm = new CreateForm({
                model: new FormModel(),
                app: this.app
            });
            // this is a hack: for now, add the modal to this view:
            this.$el.append(createForm.$el);
            this.$el.find('.modal').show();
          //alert("Display create form");
          //this.app.vent.trigger('share-project', { model: this.model });
          // How do I display the create form if there is a
          // share form at home-app.js
        }
    });
    return ToolbarDataView;
});
