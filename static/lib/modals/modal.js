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
            width: "90vw",
            //height: "70vh",
            margin: "auto",
            showCloseButton: true,
            closeButtonText: "Cancel",
            saveButtonText: "Save",
            deleteButtonText: "Delete",
            printButtonText: "Print",
            showSaveButton: true,
            showDeleteButton: true,
            regions: {
                "modalBodyRegion": '.body'
            },
            events: {
                'click .modal': 'hideIfValid',
                'click .close': 'hideIfValid',
                'click .close-modal': 'hideIfValid',
                'click .save-modal-form': 'saveFunction',
                'click .delete-modal': 'deleteFunction'
            },
            template: Handlebars.compile(ModalTemplate),
            initialize: function (opts) {
                opts = opts || {};
                _.extend(this, opts);
                this.saveFunction = function () {
                    console.log('saving 1...');
                    opts.saveFunction();
                    this.render();
                }
                this.render();
                if (!$(".modal").get(0)) {
                    $('body').append(this.$el);
                }
                this.attachEvents();
            },
            templateHelpers: function () {
                return {
                    title: this.title,
                    width: this.width,
                    height: this.height,
                    bodyClass: this.bodyClass,
                    //margin: this.margin,
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
                    this.listenTo(this.app.vent, 'update-modal-save-button', this.updateSaveButton);
                    this.listenTo(this.app.vent, 'close-modal', this.hide);
                }
            },
            update: function (opts) {
                opts.closeButtonText = opts.closeButtonText || "Cancel";
                opts.saveButtonText = opts.saveButtonText || "Save";
                opts.deleteButtonText = opts.deleteButtonText || "Delete";
                opts.printButtonText = opts.printButtonText || "Print";
                opts.bodyClass = opts.bodyClass || null;
                _.extend(this, opts);
                this.saveFunction = function () {
                    console.log('saving 2...');
                    opts.saveFunction();
                };
                this.attachEvents();
                this.render();
                this.delegateEvents();
                this.appendView();
            },

            updateSaveButton: function (opts) {
                this.$el.find('.save-modal-form').css(opts);
                if (opts.printButtonText) {
                    this.$el.find('.save-modal-form').html(opts.printButtonText);
                }
            },

            setSize: function () {
                this.$el.find('.content').css('width', this.width);
                if (this.height) {
                    this.$el.find('.body').css('height', this.height);
                }
            },
            createModal: function () {
                this.$el = $(this.template({ title: this.title }));
                $('body').append(this.$el);
            },
            show: function () {
                this.$el.find('.modal').show();
                this.$el.css('display', 'block');
            },
            hideIfValid (e) {
                // hide if called by vent or if called by one of the
                // following elements: 'modal' 'close', 'close-modal'
                const classList = e.target.classList;
                if (classList.contains('modal') ||
                    classList.contains('close') ||
                    classList.contains('close-modal')
                ) {
                    this.hide(e);
                }

            },
            hide: function (e) {
                this.$el.find('.modal').hide();
                this.render();
                if (e) {
                    e.stopPropagation();
                }
            }
        });
        return Modal;
    });
