define(['jquery',
        'form',
        'marionette',
        'google-infobubble',
        'bootstrap-form-templates'
    ],
    function ($, Form, Marionette, GoogleInfoBubble) {
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

            events: {
                "click .btn-primary": "saveForm"
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
                    padding: 0,
                    model: opts.model,
                    disableAnimation: true,
                    map: this.map
                });

                this.tip = new GoogleInfoBubble({
                    borderRadius: 5,
                    maxHeight: 385,
                    padding: 0,
                    disableAnimation: true,
                    disableAutoPan: true,
                    hideCloseButton: true,
                    map: this.map
                });
                this.listenTo(this.app.vent, 'mode-change', this.refresh);
                this.listenTo(this.app.vent, 'hide-bubbles', this.hideBubble);

            },

            refresh: function () {
                if (this.bubble.isOpen()) {
                    this.showBubble({
                        model: this.bubble.model,
                        latLng: this.bubble.position
                    });
                }
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
                var template = this.getTemplate("InfoBubbleTemplate");
                this.$el = $(template(this.getContext()));

                this.showUpdatedContent();
            },

            renderEditContent: function () {
                var that = this,
                    template = that.getTemplate("InfoBubbleTemplate"),
                    ModelForm = Form.extend({
                        schema: that.model.updateSchema
                    });
                that.setElement($(template({mode: "edit"})));
                that.form = new ModelForm({
                    model: that.model
                }).render();
                that.$el.find('.form').append(that.form.$el);

                that.showUpdatedContent();
            },

            saveForm: function (e) {
                this.form.commit();       //does validation
                this.bubble.model.save(); //does database commit
                e.preventDefault();
            },
            _show: function (whichBubble) {
                whichBubble.open(this.map, this.overlay.getGoogleOverlay());
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
            destroy: function () {
                this.remove();
            }
        });
        return Base;
    });
