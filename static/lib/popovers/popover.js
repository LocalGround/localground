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
                this.validate(opts);
                this.update(opts);
                this.popper = new Popper(
                    this.$source.get(0),
                    this.$el.find('.popper').get(0), {
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
                this.placement = opts.placement || 'left';
                _.extend(this, opts);
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
                    console.log('showing...');
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
                console.log('hiding...');
                this.$el.find('.popover').hide();
                //this.render();
                if (e) {
                    e.stopPropagation();
                }
                this.destroy();
            }
        });
        return Popover;
    });
