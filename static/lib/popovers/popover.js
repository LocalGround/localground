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
                this.listenTo(this.app.vent, 'hide-popover', this.hide)
            },
            onRender: function () {
                $('body').append(this.$el);
            },

            createPopper: function () {
                console.log(this.offsetY + ',' + this.offsetX);
                this.popper = new Popper(
                    this.$source,
                    this.$el.find('.popper'), {
                        placement: this.placement,
                        modifiers: {
                            removeOnDestroy: true,
                            onUpdate: function (data) {
                                // for whatever reason, dynamic tip positioning
                                // adjustments don't work if this is commented out.
                                console.log(data);
                            },
                            /*flip: {
                                enabled: true,
                                behavior: ['left', 'bottom', 'top']
                            },
                            keepTogether: {
                                enabled: true
                            },
                            offset: {
                                enabled: true,
                                offset: this.offsetY + ',' + this.offsetX
                            },*/
                            preventOverflow: {
                                boundariesElement: 'viewport'
                            }
                        }
                    }
                );
            },

            validate: function (opts) {
                if (!opts.$source) {
                    throw '$source element is required';
                }
                if (!opts.view) {
                    throw 'either a $content element or a view is required';
                }
            },

            templateHelpers: function () {
                return {
                    width: this.width,
                    height: this.height,
                    title: this.title,
                    vertical: this.placement === 'top' || this.placement === 'bottom',
                    horizontal: this.placement === 'left' || this.placement === 'right'
                };
            },
            appendView: function () {
                if (this.view) {
                    this.view.render();
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
                //$('body').remove(this.$el);
                //this.destroy();
            },

            resetProperties: function () {
                this.title = null;
                this.width = '100px';
                this.height = '100px';
                this.offsetX = '0px';
                this.offsetY = '0px';
                this.placement = 'right';
                this.view = null;
                this.$source = null;
            },

            update: function (opts) {
                this.resetProperties();
                _.extend(this, opts);
                this.validate(opts);
                this.render();
                this.delegateEvents();
                this.appendView();
                // setTimeout(() => {
                //     alert(this.$el.outerHeight())
                // }, 500);
                this.createPopper();
            },
        });
        return Popover;
    });
