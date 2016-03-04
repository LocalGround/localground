define(["marionette",
      "text!../../../templates/profile/item_photo_readonly.html",
      "text!../../../templates/profile/item_audio_readonly.html",
      "text!../../../templates/profile/item_map_image_readonly.html"
    ],
    function (Marionette, ItemTemplate, ItemAudioTemplate, ItemMapImageTemplate) {
        'use strict';
        var ListEditView = Marionette.ItemView.extend({
            template: _.template(ItemTemplate),
            tagName: "div",
            modelEvents: {
                    'change': 'render',
                    'save': 'render'
            },
            initialize: function (opts) {


                if (this.model.attributes["overlay_type"] == "photo") {
                  this.template = _.template(ItemTemplate);
                }
                else if (this.model.attributes["overlay_type"] == "map-image") {
                  this.template = _.template(ItemMapImageTemplate);
                }
                else if (this.model.attributes["overlay_type"] == "audio") {
                  this.template = _.template(ItemAudioTemplate);
                }

            }
            

        });
        return ListEditView;
    });
