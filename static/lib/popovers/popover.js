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
                'click .popover': 'hideIfValid',
                'click .close': 'hideIfValid'
            },
            template: Handlebars.compile(PopoverTemplate),
            initialize: function (opts) {
                _.extend(this, opts);
            },

            createPopper: function () {
                this.popper = new Popper(
                    this.$source,
                    this.$el.find('.popper'), {
                        placement: this.placement,
                        modifiers: {
                            onUpdate: (data) => {
                                console.log(data);
                            },
                            removeOnDestroy: true,
                            offset: {
                                enabled: true,
                                offset: this.offsetY + ',' + this.offsetX
                            },
                            preventOverflow: {
                                boundariesElement: 'viewport'
                            }
                        }
                    });
                if (!$(".popover").get(0)) {
                    $('body').append(this.$el);
                }
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
                this.width = this.width || opts.width || '100px';
                this.height = this.height || opts.height || '100px';
                this.offsetX = this.offsetX || opts.offsetX || '-5px';
                this.offsetY = this.offsetY || opts.offsetY || '0px';
                this.placement = opts.placement || 'right';
                _.extend(this, opts);
                this.validate(opts);
                this.render();
                this.delegateEvents();
                this.createPopper();
                this.appendView();
            },

            templateHelpers: function () {
                return {
                    width: this.width,
                    height: this.height,
                    title: this.title
                };
            },
            appendView: function () {
                if (this.view) {
                    this.bodyRegion.show(this.view);
                }
            },
            show: function () {
                this.$el.find('.popover').show();
            },
            hideIfValid (e) {
                // hide if called by vent or if called by one of the
                // following elements: 'modal' 'close', 'close-modal'
                const classList = e.target.classList;
                if (classList.contains('popover') ||
                    classList.contains('close')
                ) {
                    this.hide(e);
                }

            },
            hide: function (e) {
                this.$el.find('.popover').hide();
                this.popper.destroy();
                if (e) {
                    e.stopPropagation();
                }
                //this.destroy();
            }
        });
        return Popover;
    });
