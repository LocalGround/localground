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
                'click .popover': '_hideIfValid',
                'click .close': '_hideIfValid'
            },

            template: Handlebars.compile(PopoverTemplate),
            initialize: function (opts) {
                _.extend(this, opts);
                this.listenTo(this.app.vent, 'hide-popover', this.hide)
            },
            _removeHeight: function () {
                this.$el.find('.popper .body').removeAttr('style');
            },
            _setHeight: function () {
                this.$el.find('.popper .body').css(
                    'height', this.$el.find('.popper .body').height() + 5)
            },
            _createPopper: function () {
                this._setHeight();
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
                            preventOverflow: {
                                boundariesElement: 'viewport'
                            },
                            offset: {
                                enabled: true,
                                offset: this.offsetY + ',' + this.offsetX
                            }
                        }
                    }
                );
            },

            _validate: function (opts) {
                if (!opts.$source) {
                    throw '$source element is required';
                }
                if (!opts.view) {
                    throw 'either a $content element or a view is required';
                }
            },
            _appendView: function () {
                if (this.view) {
                    this.view.render();
                    this.bodyRegion.show(this.view);
                }
            },
            _hideIfValid (e) {
                // hide if called by vent or if called by one of the
                // following elements: 'modal' 'close', 'close-modal'
                const classList = e.target.classList;
                if (classList.contains('popover') ||
                    classList.contains('close')
                ) {
                    this.hide(e);
                }

            },

            _resetProperties: function () {
                this.title = null;
                this.width = '100px';
                this.offsetX = '0px';
                this.offsetY = '0px';
                this.placement = 'right';
                this.view = null;
                this.$source = null;
            },

            onRender: function () {
                $('body').append(this.$el);
            },

            templateHelpers: function () {
                return {
                    includeArrow: this.includeArrow,
                    width: this.width,
                    title: this.title,
                    vertical: this.placement === 'top' || this.placement === 'bottom',
                    horizontal: this.placement === 'left' || this.placement === 'right'
                };
            },

            show: function () {
                this.$el.find('.popover').show();
            },

            hide: function (e) {
                this.$el.find('.popover').hide();
                this._removeHeight();
                if (this.popper) {
                    this.popper.destroy();
                }
                this.popper = null;
                if (e) {
                    e.stopPropagation();
                }
            },

            update: function (opts) {
                this.includeArrow = true;
                this._resetProperties();
                _.extend(this, opts);
                this._validate(opts);
                this.render();
                this.delegateEvents();
                this._appendView();
                this.show();
                this._createPopper();
            },

            redraw: function (opts) {
                if (!this.popper) {
                    return;
                }
                this.hide();
                _.extend(this, opts);
                this.show();
                this.bodyRegion.show(this.view);
                this._createPopper();
            }
        });
        return Popover;
    });
