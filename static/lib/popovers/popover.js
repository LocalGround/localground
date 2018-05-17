define([
        "jquery", "underscore", "marionette", "handlebars",
        "text!../popovers/popover.html",
        "external/tooltips/popper"
    ], function ($, _, Marionette, Handlebars, PopoverTemplate, Popper) {
        'use strict';

        var Popover = Marionette.LayoutView.extend({
            regions: {
                "bodyRegion": '.body'
            },

            events: {
                'click .modal': 'hideIfValid',
                'click .close': 'hideIfValid'
            },
            template: Handlebars.compile(PopoverTemplate),
            className: 'popper',
            initialize: function (opts) {
                this.validate(opts);
                this.update(opts);
                this.popper = new Popper(this.$source.get(0), this.$el.get(0), {
                    placement: this.placement,
                    modifiers: {
                        offset: {
                            enabled: true,
                            offset: '0,-4'
                        },
                        preventOverflow: {
                            boundariesElement: 'viewport'
                        }
                    }
                });
                if (!$(".popper").get(0)) {
                    $('body').append(this.$el);
                }
                this.show();
            },

            validate: function (opts) {
                if (!opts.$source) {
                    throw '$source element is required';
                }
                if (!opts.$content && !opts.view) {
                    throw 'either a $content element or a view is required';
                }
            },

            update: function (opts) {
                this.width = opts.width || '100px';
                this.height = opts.height || '100px';
                this.placement = opts.placement || 'left';
                _.extend(this, opts);
                this.$el.width(this.width);
                this.$el.height(this.height);
                this.render();
                this.delegateEvents();
                this.appendView();
            },

            templateHelpers: function () {
                return {
                    width: this.width,
                    height: this.height,
                    title: 'Symbol Properties'
                };
            },
            appendView: function () {
                if (this.view) {
                    this.bodyRegion.show(this.view);
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
                this.$el.show();
            },
            hideIfValid (e) {
                // hide if called by vent or if called by one of the
                // following elements: 'modal' 'close', 'close-modal'
                const classList = e.target.classList;
                if (classList.contains('modal') ||
                    classList.contains('close')
                ) {
                    this.hide(e);
                }

            },
            hide: function (e) {
                this.$el.hide();
                //this.render();
                if (e) {
                    e.stopPropagation();
                }
                this.destroy();
            }
        });
        return Popover;
    });
