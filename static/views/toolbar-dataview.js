var t;
define([
    "underscore",
    "jquery",
    "handlebars",
    "marionette",
    "collections/forms",
    "views/create-form",
    "views/form-list",
    "lib/modals/modal",
    "text!../templates/toolbar-dataview.html"
], function (_, $, Handlebars, Marionette, Forms, CreateForm,
             FormList, Modal, ToolbarTemplate) {
    "use strict";
    var ToolbarDataView = Marionette.ItemView.extend({
        /*
        Because of the blinking, consider:
        http://stackoverflow.com/questions/10746706/attaching-backbone-js-views-to-existing-elements-vs-inserting-el-into-the-doms
        */
        events: {
            'click #toolbar-search': 'doSearch',
            'click #toolbar-clear': 'clearSearch',
            //'change .media-type': 'changeDisplay',
            'click .add-data' : 'showFormList',
            'click #show-media-type' : 'showMediaTypeForm',
            'click #add-row' : 'triggerAddRow',
            'click .dropdown-menu a': 'route',
            'click .add': 'toggleMenu'
        },
        modal: null,
        forms: null,

        template: Handlebars.compile(ToolbarTemplate),

        templateHelpers: function () {
            console.log(this.app.screenType);
            return {
                mode: this.app.mode,
                dataType: this.app.dataType,
                screenType: this.app.screenType,
                activeTab: this.app.activeTab,
                forms: this.forms.toJSON()
            };
        },
        route: function (e) {
            console.log("route");
            if (!e) {
                return;
            }
            var route = $(e.currentTarget).attr("href").replace("#", "/");
            this.app.router.navigate(route, { trigger: true });
        },

        initialize: function (opts) {
            _.extend(this, opts);
            Marionette.ItemView.prototype.initialize.call(this);
            this.template = Handlebars.compile(ToolbarTemplate);

            // Collection of listeners
            this.listenTo(this.app.vent, 'add-data', this.showCreateForm);
            this.listenTo(this.app.vent, 'show-media-type', this.showMediaTypeForm);
            this.listenTo(this.app.vent, 'tab-switch', this.changeMode);
            this.listenTo(this.app.vent, 'show-form', this.showCreateForm);
            this.listenTo(this.app.vent, 'show-form-list', this.showFormList);
            this.listenTo(this.app.vent, 'show-modal', this.showModal);
            this.listenTo(this.app.vent, 'hide-modal', this.hideModal);
            this.listenTo(this.app.vent, 'show-list', this.updateNewObejctRoute);
            this.listenTo(this.app.vent, 'add-new-item-to-map', this.triggerAddNewMap);
            this.listenTo(this.app.vent, 'route', this.route);

            $('body').click(this.hideMenus);
            this.modal = new Modal();
            this.forms = new Forms(null, { projectID: this.app.getProjectID() });
            this.listenTo(this.forms, "reset", this.render);
            //this.forms.setServerQuery("WHERE project_id = " + this.app.getProjectID());
            this.listenTo(this.forms, 'reset', this.renderAndRoute);
            this.forms.fetch({ reset: true });
        },

        hideMenus: function (e) {
            // Maybe this is responsible for hiding the add button?
            var $el = $(e.target);
            if (!$el.hasClass('add') &&
                    !$el.parent().hasClass('add') &&
                    !$el.parent().hasClass('media-type')) {
                $("#add-data-type").hide();
            }
        },

        toggleMenu: function (e) {
            var $btn = $(e.target);
            this.$el.find("#add-data-type").toggle().css({
                top: $btn.position().top + 30,
                left: $btn.position().left
            });
        },

        triggerAddRow: function (e) {
            this.app.vent.trigger('add-row');
            e.preventDefault();
        },

        changeMode: function () {
            this.renderAndRoute();
        },
        updateNewObejctRoute: function () {
            this.$el.find("#add-site").attr("href", '#/' + this.app.dataType + '/new');
        },

        renderAndRoute: function () {
            this.forms.each(function (form) {
                //TODO: add to API:
                form.set("overlay_type", "form_" + form.get("id"));
            });
            this.render();
            //this.app.router.navigate(this.$el.find(".media-type").val(), { trigger: true });
        },

        //*
        doSearch: function (e) {
            /*
             * NOTE
             *   - app.js is listening for the search-requested event
             *   - Please see localground/apps/site/api/tests/sql_parse_tests.py
             *     for samples of valid queries.
             */

            var term = this.$el.find("#searchTerm").val();
            if (term === "") {
                this.app.vent.trigger("clear-search");
            } else {
                this.app.vent.trigger("search-requested", term);
            }
            e.preventDefault();
        },

        //*/

        /*changeDisplay: function (e) {
            var dataType =  $(e.currentTarget).val();
            this.app.router.navigate('//' + dataType, { trigger: true });
        },*/

        showFormList: function () {
            var formList = new FormList({
                app: this.app
            });
            this.modal.update({
                view: formList,
                title: 'List of Forms',
                width: 800,
                showSaveButton: false,
                showDeleteButton: false
                // bind the scope of the save function to the source view:
                //saveFunction: createForm.saveFormSettings.bind(createForm)
            });
            this.modal.show();
        },

        showModal: function (opts) {
            //generic function that displays a view in a modal
            var params = {};
            _.extend(params, opts);
            _.extend(params, {
                showSaveButton: opts.saveFunction ? true : false,
                showDeleteButton: opts.deleteFunction ? true : false,
                saveFunction: opts.saveFunction ? opts.saveFunction.bind(opts.view) : null,
                deleteFunction: opts.deleteFunction ? opts.deleteFunction.bind(opts.view) : null
            });
            this.modal.update(params);
            this.modal.show();
        },

        hideModal: function () {
            this.modal.hide();
        },

        showCreateForm: function (opts) {
            opts = opts || {};
            var createForm = new CreateForm({
                    app: this.app,
                    model: opts.model
                }),
                title = "Create New Form";
            if (opts.model) {
                title = "Update " + opts.model.get("name") + " Settings";
            }
            this.modal.update({
                view: createForm,
                title: title,
                width: 800,
                showSaveButton: true,
                showDeleteButton: opts.model,
                // bind the scope of the save function to the source view:
                saveFunction: createForm.saveFormSettings.bind(createForm),
                deleteFunction: createForm.deleteForm.bind(createForm)
            });
            this.modal.show();
        }

    });
    return ToolbarDataView;
});
