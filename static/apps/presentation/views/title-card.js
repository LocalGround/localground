define(["underscore",
        "marionette",
        "handlebars",
        "lib/carousel/carousel",
        "text!../templates/title-card.html"
    ],
    function (_, Marionette, Handlebars, Carousel, TitleCard) {
        'use strict';
        var TitleCard = Marionette.ItemView.extend({

            template: Handlebars.compile(TitleCard),

            initialize: function (opts) {
                _.extend(this, opts);
                //this.render();
            },
            templateHelpers: function () {
                return {
                    header: this.model.get('title'),
                    description: this.model.get('description')
                }
            },
            onRender: function () {
                if (this.model.get('photoList') > 0) {
                    const carousel = new Carousel({
                        model: this.model,
                        app: this.app,
                        mode: "photos",
                        collection: new Backbone.Collection(this.model.get('photoList')),
                        panelStyles: null
                    });
                    this.$el.find(".carousel").append(carousel.$el);
                }
            }
        });
        return TitleCard;
    });