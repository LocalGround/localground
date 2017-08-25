/**
 * Created by zmmachar on 12/17/14.
 */
define(["jquery", "underscore", "marionette", "handlebars", "text!../modals/modal.html"],
    function ($, _, Marionette, Handlebars, ModalTemplate) {
        'use strict';
        /**
         * The Printloader class handles loading data for the print generation form
         * @class PrintLoader
         */
        var Modal = Marionette.LayoutView.extend({
            view: null,
            title: null,
            width: 800,
            height: 200,
            showCloseButton: true,
            closeButtonText: "Cancel",
            saveButtonText: "Save",
            deleteButtonText: "Delete",
            printButtonText: "Print",
            showSaveButton: true,
            showDeleteButton: true,
            regions: {
                "modalBodyRegion": '.modal-body'
            },
            events: {
                'click .close': 'hide',
                'click .close-modal': 'hide',
                'click .save-modal-form': 'saveFunction',
                'click .delete-modal': 'deleteFunction'
            },
            deleteFunction: function () {
                alert("blah");
            },
            template: Handlebars.compile(ModalTemplate),
            initialize: function (opts) {
                opts = opts || {};
                _.extend(this, opts);
                this.saveFunction = opts.saveFunction;
                if (!$(".modal").get(0)) {
                    this.render();
                    $('body').append(this.$el);
                } else {
                    this.$el = $('<div></div>').append($(".modal"));
                    $('body').append(this.$el);
                }
                this.attachEvents();
                this.appendView();
            },
            templateHelpers: function () {
                return {
                    title: this.title,
                    width: this.width,
                    height: this.height,
                    showSaveButton: this.showSaveButton,
                    showDeleteButton: this.showDeleteButton,
                    closeButtonText: this.closeButtonText,
                    saveButtonText: this.saveButtonText,
                    deleteButtonText: this.deleteButtonText,
                    printButtonText: this.printButtonText
                };
            },
            appendView: function () {
                if (this.view) {
                    this.modalBodyRegion.show(this.view);
                }
            },
            attachEvents: function () {
                if (this.app) {
                    console.log('adding listener...');
                    this.listenTo(this.app.vent, 'update-modal-save-button', this.updateSaveButton);
                }
            },
            update: function (opts) {
                opts.closeButtonText = opts.closeButtonText || "Cancel";
                opts.saveButtonText = opts.saveButtonText || "Save";
                opts.deleteButtonText = opts.deleteButtonText || "Delete";
                opts.printButtonText = opts.printButtonText || "Print";
                _.extend(this, opts);
                //this.saveFunction = function () {alert("hello!");}
                console.log(this.saveFunction);
                this.attachEvents();
                this.render();
                this.delegateEvents();
                this.appendView();
            },

            updateSaveButton: function (opts) {
                console.log('updateSaveButton');
                this.$el.find('.save-modal-form').css(opts);
                if (opts.printButtonText) {
                    this.$el.find('.save-modal-form').html(opts.printButtonText);
                }
            },

            setSize: function () {
                this.$el.find('.modal-content').css('width', this.width);
                this.$el.find('.modal-body').css('min-height', this.height);
            },
            createModal: function () {
                this.$el = $(this.template({ title: this.title }));
                $('body').append(this.$el);
            },
            show: function () {
                this.$el.find('.modal').show();
                this.$el.css('display', 'block');
            },
            hide: function () {
                this.$el.find('.modal').hide();
                this.render();
            }
        });
        return Modal;
    });
