define(['jquery',
        'underscore',
        'backbone',
        'marionette',
        'infobubble',
        'config',
        'color-picker',
        "text!../../../../templates/infoBubble/marker.html",
        'form',
        "bootstrap-form-templates",
        'slick'
    ],
    function ($, _, Backbone, Marionette, InfoBubble, Config, jscolor, markerBubbleTemplate) {
        'use strict';
        /**
         * Manages InfoBubble Rendering
         * @class InfoBubble
         */
        var BubbleManager = Marionette.View.extend({
            /**
             * @lends localground.maps.views.InfoBubble#
             */

            /** A google.maps.Map object */
            map: null,

            /** A hook to global application events */
            bubble: null,
            tip: null,
            bubbleModel: null,
            tipModel: null,

            events: {
                "click .btn-primary": "saveForm"
            },

            /**
             * Initializes
             */
            initialize: function (sb) {
                this.sb = sb;
                this.map = sb.getMap();
                this.bubble = new InfoBubble({
                    borderRadius: 5,
                    maxHeight: 385,
                    padding: 0,
                    disableAnimation: true,
                    map: this.map
                });

                this.tip = new InfoBubble({
                    borderRadius: 5,
                    maxHeight: 385,
                    padding: 0,
                    disableAnimation: true,
                    disableAutoPan: true,
                    hideCloseButton: true,
                    map: this.map
                });
                /* TODO: change event listener
                sb.listen({
                    "show-bubble": this.showBubble,
                    "hide-bubble": this.hideBubble,
                    "show-tip": this.showTip,
                    "hide-tip": this.hideTip,
                    "mode-change": this.refresh
                });
                */
            },

            /**
             * Jams template inside infoBubble
             */
            render: function (opts) {
                //$(this.el).html(this.template(opts));
            },

            refresh: function () {
                if (this.bubble.isOpen()) {
                    this.showBubble({
                        model: this.bubble.model,
                        latLng: this.bubble.position
                    });
                }
            },

            showBubble: function (data) {
                var that = this,
                    model = data.model;
                this.bubbleModel = model;
                this.tip.close();
                this.showLoadingImage(data);
                this.bubble.model = smodel;
                model.fetch({ success: function () {
                    that.renderBubble(data);
                }});
            },
            renderBubble: function (data) {
                if (this.sb.getMode() === "view") {
                    this.renderViewContent(data);
                } else {
                    this.renderEditContent(data);
                }
            },
            renderViewContent: function (data) {
                var template = this.getTemplate(data.model, "InfoBubbleTemplate");
                this.$el = $(template(this.getContext(data.model)));

                this.showUpdatedContent(data);

                //only relevant for marker in view mode:
                window.setTimeout(function () {
                    $('.marker-container').slick({
                        dots: false
                    });
                }, 200);
            },

            renderEditContent: function (data) {
                var that = this,
                    template = that.getTemplate(data.model, "InfoBubbleTemplate"),
                    ModelForm = Backbone.Form.extend({
                        schema: data.model.updateSchema
                    });
                that.setElement($(template({mode: "edit"})));
                that.form = new ModelForm({
                    model: data.model
                }).render();
                that.$el.find('.form').append(that.form.$el);

                //init color picker if applicable:
                that.initColorPicker(data);

                that.showUpdatedContent(data);
            },

            initColorPicker: function (data) {
                var colorInput = this.$el.find('.form').find('[name="color"]');
                if (colorInput.get(0) != null) {
                    var picker = new jscolor.color(colorInput.get(0), {})
                    picker.fromString("#" + data.model.get("color"));
                }
            },

            saveForm: function (e) {
                this.form.commit();       //does validation
                this.bubble.model.save(); //does database commit
                e.preventDefault();
            },
            _show: function (whichBubble, data) {
                if (data.marker) {
                    whichBubble.open(this.map, data.marker);
                } else {
                    whichBubble.setPosition(data.center);
                    whichBubble.open();
                }
            },
            showLoadingImage: function (data) {
                var $loading = $('<div class="loading-container" style="width:300px;height:200px;"><i class="fa fa-spin fa-cog"></i></div>');
                this.bubble.setContent($loading.get(0));
                this._show(this.bubble, data);
            },
            showUpdatedContent: function (data) {
                this.bubble.setContent(this.$el.get(0));
                this._show(this.bubble, data);
            },
            hideBubble: function (data) {
                if (this.bubbleModel === data.model) {
                    this.bubble.close();
                }
            },
            showTip: function (data) {
                if (this.sb.getMode() === "edit") {
                    return;
                }
                if (this.bubble.model && this.bubble.model.id === data.model.id &&
                        this.bubble.isOpen()) {
                    return;
                }
                var template = this.getTemplate(data.model, "TipTemplate");
                this.tip.setContent(template(this.getContext(data.model)));
                this._show(this.tip, data);
            },
            hideTip: function () {
                this.tip.close();
            },
            getTemplate: function (model, templateKey) {
                var configKey = model.getKey().split("_")[0],
                    template = Config[configKey][templateKey];
                return _.template(template);
            },
            getContext: function (model) {
                var json = model.toTemplateJSON();
                json.mode = this.sb.getMode();
                return json;
            },
            destroy: function () {
                this.remove();
            }
        });
        return BubbleManager;
    });
