define(['jquery',
        'form',
        'marionette',
        'google-infobubble',
        'underscore',
        'bootstrap-form-templates'
    ],
    function ($, Form, Marionette, GoogleInfoBubble, _) {
        'use strict';
        /**
         * Manages InfoBubble Rendering
         * @class InfoBubble
         */
        var Base = Marionette.View.extend({
            /**
             * @lends localground.maps.views.InfoBubble#
             */

            /** A google.maps.Map object */
            map: null,

            /** A hook to global application events */
            bubble: null,
            tip: null,
            tipModel: null,
            template: null,
            overlay: null,

            events: {
                'click .btn-primary': 'saveForm',
                'click .btn-secondary': 'hideBubble'
            },

            modelEvents: {
                'show-bubble': 'showBubble',
                'hide-bubble': 'hideBubble',
                'show-tip': 'showTip',
                'hide-tip': 'hideTip'
            },

            /**
             * Initializes
             */
            initialize: function (opts) {
                this.opts = opts;
                $.extend(this, opts);
                this.map = this.app.getMap();
                this.bubble = new GoogleInfoBubble({
                    borderRadius: 5,
                    maxHeight: 385,
                    zIndex: 200,
                    padding: 0,
                    model: opts.model,
                    disableAnimation: true,
                    map: this.map
                });

                this.tip = new GoogleInfoBubble({
                    borderRadius: 5,
                    maxHeight: 385,
                    padding: 0,
                    zIndex: 100,
                    disableAnimation: true,
                    disableAutoPan: true,
                    hideCloseButton: true,
                    map: this.map
                });
                this.listenTo(this.app.vent, 'mode-change', this.refresh);
                this.listenTo(this.app.vent, 'hide-bubbles', this.hideBubble);
                this.listenTo(this.model, 'show-bubble', this.showBubble);
                this.listenTo(this.model, 'change', this.refresh);
                google.maps.event.addListener(this.bubble, 'domready', this.onBubbleRender.bind(this));
            },

            refresh: function () {
                if (this.bubble.isOpen()) {
                    this.showBubble({
                        model: this.bubble.model,
                        latLng: this.bubble.position
                    });
                }
            },

            onBubbleRender: function () {
                //Override this in child class
            },

            showBubble: function () {
                this.tip.close();
                this.app.vent.trigger('hide-bubbles', this.model.id);
                this.renderBubble();
            },

            renderBubble: function () {
                if (this.app.getMode() === "view") {
                    this.renderViewContent();
                } else {
                    this.renderEditContent();
                }
            },

            renderViewContent: function () {
                var template = this.getTemplate("InfoBubbleTemplate"),
                    that = this;
                this.$el = $(template(this.getContext()));
                this.$el.click(function (e) {
                    that.bringToFront(e);
                });
                this.showUpdatedContent();
            },
            bringToFront: function (e) {
                var zIndex;
                zIndex = parseInt(this.bubble.bubble_.style.zIndex, 10);
                this.bubble.bubble_.style.zIndex = zIndex + 1;
                e.preventDefault();
            },
            sendToBack: function (e) {
                var zIndex;
                zIndex = parseInt(this.bubble.bubble_.style.zIndex, 10);
                this.bubble.bubble_.style.zIndex = zIndex - 1;
                e.preventDefault();
            },
            renderEditContent: function () {
                var template = this.getTemplate("InfoBubbleTemplate"),
                    ModelForm = Form.extend({
                        schema: this.model.updateSchema
                    }),
                    context = this.getContext(this.model);
                //console.log(this.model.updateSchema);
                context.mode = 'edit';
                this.setElement($(template(context)));
                this.form = new ModelForm({
                    model: this.model
                }).render();
                this.$el.find('.form').append(this.form.$el);

                this.showUpdatedContent();
            },

            saveForm: function (e) {
                //does validation
                var errors = this.form.commit();
                if (errors) { return; }

                // some JSON post-processing:
                this.bubble.model.setExtras(this.bubble.model.get("extras"));

                this.bubble.model.save(); //does database commit
                this.hideBubble();
                e.preventDefault();
            },
            _show: function (whichBubble) {
                if (this.overlay.getShapeType() === "Point") {
                    whichBubble.open(this.map, this.overlay.getGoogleOverlay());
                } else {
                    whichBubble.setPosition(this.overlay.getCenter());
                    whichBubble.open();
                }
            },
            /*
            showLoadingImage: function () {
                var $loading = $('<div class="loading-container" style="width:300px;height:200px;"><i class="fa fa-spin fa-cog"></i></div>');
                this.bubble.setContent($loading.get(0));
                this._show(this.bubble, data);
            },*/
            showUpdatedContent: function () {
                this.bubble.setContent(this.$el.get(0));
                this._show(this.bubble);
            },
            hideBubble: function (exception) {
                if (!exception || exception !== this.model.id) {
                    this.bubble.close();
                }
            },
            showTip: function () {
                //TODO: remove compatibility hack
                if (this.app.getMode() === "edit" || this.bubble.isOpen()) {
                    return;
                }
                var template = this.getTemplate("TipTemplate");
                this.tip.setContent(template(this.getContext()));
                this._show(this.tip);

            },
            hideTip: function () {
                this.tip.close();
            },
            getTemplate: function (templateKey) {
                return this.infoBubbleTemplates[templateKey];
            },
            getContext: function () {
                var json = this.model.toTemplateJSON();
                json.mode = this.app.getMode();
                return json;
            },
            remove: function () {
                this.hideTip();
                this.hideBubble();
            }
        });
        return Base;
    });
