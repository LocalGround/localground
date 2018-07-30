define ([
    "underscore",
    "marionette",
    "handlebars",
    "lib/audio/audio-player",
    "text!../templates/table.html",
    "text!../templates/thumb.html"],
    function (_, Marionette, Handlebars, AudioPlayer, TableTemplate, ThumbTemplate) {
        'use strict';

        var MediaBrowserChildView = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.render();
            },
            getTemplate: function () {
                if (this.parent.viewMode == "thumb") {
                    return Handlebars.compile(ThumbTemplate);
                }
                return Handlebars.compile(TableTemplate);
            },
            events: {
                'click' : 'doSelection',
                'click td' : "doSelection"
            },

            doSelection: function (e) {
                if (this.tagName === "tr") {
                    this.selectedClass(e, this.parent.$el.find("tr"));
                } else {
                    this.selectedClass(e, this.parent.$el.find(".column"));
                }
            },
            selectedClass: function (e, $columns) {
                var hasPrevModel, previousModel, currentModel,
                    startIndex, endIndex, i, currModel, currColumn;

                // 1) if neither SHIFT nor CMD selected, clear everything:
                if (!e.metaKey && !e.shiftKey) {
                    $columns.removeClass("selected-card");
                    this.model.collection.each(function (model) {
                        model.set("isSelected", false);
                    });
                }

                // 2) Then either select or deselect current element:
                if (this.$el.hasClass("selected-card")) {
                    this.$el.removeClass("selected-card");
                    this.model.set("isSelected", false);
                } else {
                    this.$el.addClass("selected-card");
                    this.model.set("isSelected", true);
                }

                // 3) then, if shift key selected, select everything in between:
                if (e.shiftKey) {
                    hasPrevModel = true;
                    if (this.parent.lastSelectedModel == null) {
                        hasPrevModel = false;
                    }

                    if (hasPrevModel) {
                        previousModel = this.parent.lastSelectedModel;
                        currentModel = this.model;
                        if (this.model.collection.indexOf(previousModel) <
                                this.model.collection.indexOf(currentModel)) {
                            startIndex = this.model.collection.indexOf(previousModel);
                            endIndex = this.model.collection.indexOf(currentModel);
                        } else {
                            endIndex = this.model.collection.indexOf(previousModel);
                            startIndex = this.model.collection.indexOf(currentModel);
                        }

                        for (i = startIndex + 1; i < endIndex + 1; i++) {
                            currModel = this.model.collection.models[i];
                            currColumn = $columns.eq(i);
                            currColumn.addClass("selected-card");
                            currModel.set("isSelected", true);
                        }
                    }
                }

                // 4) Finally, remember lastSelectedModel:
                if (this.$el.hasClass("selected-card")) {
                    this.parent.lastSelectedModel = this.model;
                } else {
                    this.parent.lastSelectedModel = null;
                }
                e.preventDefault();
            },

            // onRender: function () {
            //     //console.log('rendering child view...')
            //     var player;
            //     if (this.currentMedia == "audio") {
            //         player = new AudioPlayer({
            //             model: this.model,
            //             audioMode: "simple",
            //             app: this.app
            //         });
            //         this.$el.find(".player-container").html(player.$el);
            //     }
            // },

            templateHelpers: function () {
                return {
                    dataType: this.currentMedia
                };
            }
        });
        return MediaBrowserChildView;
    });
