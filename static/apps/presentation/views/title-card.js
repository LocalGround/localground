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
                console.log(this);
                //this.render();
            },
            templateHelpers: function () {
                return {
                    header: this.model.get('title'),
                    description: this.model.get('description')
                }
            },
            onRender: function () {
                if (this.model.get('photoList').length > 0) {
                    let photos = [];
                    this.model.get('photoList').forEach((photoId) => {
                        let photo = this.app.dataManager.getPhoto(photoId);
                        if (photo) {
                            photos.push(photo);
                        }
                    });
                    const carousel = new Carousel({
                        model: this.model,
                        app: this.app,
                        mode: "videos",
                        collection: new Backbone.Collection(photos),
                        panelStyles: null
                    });
                    this.$el.find(".carousel").append(carousel.$el);
                }
            }
        });
        return TitleCard;
    });