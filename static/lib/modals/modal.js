define(["jquery", "underscore", "marionette", "handlebars", "text!../modals/modal.html"],
    function ($, _, Marionette, Handlebars, ModalTemplate) {
        'use strict';
        var Modal = Marionette.LayoutView.extend({
            view: null,
            title: null,
            noTitle: false,
            noFooter: false,
            width: "90vw",
            bodyClass: null,
            modalClass: null,
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
                $('body').append(this.$el);
                // if you only want one modal to exist, do this:
                // if (!$(".modal").get(0)) {
                //     $('body').append(this.$el);
                // }
                this.attachEvents();
            },
            templateHelpers: function () {
                return {
                    title: this.title,
                    width: this.width,
                    height: this.height,
                    bodyClass: this.bodyClass,
                    modalClass: this.modalClass,
                    noTitle: this.noTitle,
                    noFooter: this.noFooter,
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
                opts.noTitle = opts.noTitle || false;
                opts.noFooter = opts.noFooter || false;
                opts.bodyClass = opts.bodyClass || null;
                opts.modalClass = opts.modalClass || null;
                _.extend(this, opts);
                this.saveFunction = function () {
                    opts.saveFunction();
                };
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
