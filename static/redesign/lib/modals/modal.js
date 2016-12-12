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
                if (!$(".modal").get(0)) {
                    this.render();
                    $('body').append(this.$el);
                    console.log($('body').html());
                } else {
                    this.$el = $('<div></div>').append($(".modal"));
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
                this.render();
                this.delegateEvents();
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
                console.log('show');
                this.$el.find('.modal').show();
                this.$el.css('display', 'block');
            },
            hide: function () {
                console.log('hide');
                this.$el.find('.modal').hide();
            }
        });
        return Modal;
    });
