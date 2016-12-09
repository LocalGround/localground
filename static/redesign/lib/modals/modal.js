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
        var Modal = Marionette.ItemView.extend({
            view: null,
            title: null,
            width: 800,
            height: 200,
            events: {
                'click .close': 'hide',
                'click .close-modal': 'hide',
                'click .save-modal-form': 'saveFunction'
            },
            template: Handlebars.compile(ModalTemplate),
            initialize: function (opts) {
                opts = opts || {};
                _.extend(this, opts);
                this.saveFunction = opts.saveFunction;
                this.$el = $(".modal");
                if (!this.$el.get(0)) {
                    //this.createModal();
                    this.render();
                    console.log(this.$el);
                    $('body').append(this.$el);
                }
                this.appendView();
                //this.setSize();
            },
            templateHelpers: function () {
                return {
                    title: this.title,
                    width: this.width,
                    height: this.height
                };
            },
            appendView: function () {
                if (this.view) {
                    this.$el.find('.modal-body').empty();
                    this.$el.find('.modal-body').append(this.view.$el);
                }
            },
            update: function (opts) {
                _.extend(this, opts);
                this.appendView();
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
                this.$el.show();
            },
            hide: function () {
                this.$el.hide();
            }
        });
        return Modal;
    });
