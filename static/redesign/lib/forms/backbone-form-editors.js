define([
    "jquery",
    "backbone",
    "handlebars",
    "models/association",
    "models/audio",
    "apps/gallery/views/add-media",
    "lib/audio/audio-player",
    "external/pikaday-forked",
    "https://cdnjs.cloudflare.com/ajax/libs/date-fns/1.28.5/date_fns.min.js",
    "text!../forms/templates/date-time-template.html",
    "text!../forms/templates/media-editor-template.html",
    "form"
], function ($, Backbone, Handlebars, Association, Audio, AddMedia, AudioPlayer,
             Pikaday, dateFns, DateTimeTemplate, MediaTemplate) {
    "use strict";

    Backbone.Form.editors.Rating = Backbone.Form.editors.Select.extend({
        getValue: function () {
            var value = this.$el.val();
            return parseInt(value, 10);
        }
    });

    Backbone.Form.editors.DatePicker = Backbone.Form.editors.Text.extend({

        initialize: function (options) {
            Backbone.Form.editors.Text.prototype.initialize.call(this, options);
            this.$el.addClass('datepicker input-small-custom');
        },
        getValue: function () {
            var value = this.$el.val();
            return value;
        },
        render: function () {
            Backbone.Form.editors.Text.prototype.render.apply(this, arguments);
            var picker = new Pikaday({
                field: this.$el[0],
                format: "YYYY-MM-DDThh:mm",
                toString: function (date, format) {
                    return dateFns.format(date, format);
                }
            });
            return this;
        }
    });

    Backbone.Form.editors.DateTimePicker = Backbone.Form.editors.Base.extend({
        tagName: "div",
        picker: null,
        format: "YYYY-MM-DD",
        initialize: function (options) {
            options.schema.validators = [this.dateTimeValidator];
            Backbone.Form.editors.Text.prototype.initialize.call(this, options);
            var template = Handlebars.compile(DateTimeTemplate);
            if (!this.value) {
                this.$el.append(template({
                    hoursString: "00",
                    minutesString: "00",
                    secondsString: "00"
                }));
                return;
            }
            var hours = parseInt(dateFns.format(this.value, 'HH'));
            var isPm = hours >= 12 ? true: false;
            var ds = dateFns.format(this.value, this.format);
            console.log('initialize:', ds);
            this.$el.append(template(
                {
                    dateString: ds,
                    hoursString: dateFns.format(this.value, 'hh'),
                    minutesString: dateFns.format(this.value, 'mm'),
                    secondsString: dateFns.format(this.value, 'ss'),
                    am_pm_String: dateFns.format(this.value, 'a'),
                    hours: hours,
                    isPm: isPm
                })
            );
        },
        dateTimeValidator: function (value, formValues) {
            try {
                var d = new Date(value);
                if (d == "Invalid Date") {
                    return {
                        type: 'date',
                        message: 'Invalid date / time value. Format is: YYYY-MM-DDThh:mm:ss. Please try again.'
                    };
                }
            } catch (ex) {
                return {
                    type: 'date',
                    message: 'Invalid date / time value. Format is: YYYY-MM-DDThh:mm:ss. Please try again.'
                };
            }
            return null;
        },
        getValue: function () {
            //contatenate the date and time input values
            var date = dateFns.format(this.$el.find('input.datepicker').val(), this.format),
                dateStr = this.$el.find('.datepicker').val(),
                am_pm = this.$el.find('.am_pm').val(),
                hours = this.$el.find('.hours').val(),
                hours00 = hours.substr(hours.length - 2),
                hourInt = parseInt(hours00, 10),
                minutes = this.$el.find('.minutes').val(),
                minutes00 = minutes.substr(minutes.length - 2),
                minuteInt = parseInt(minutes00, 10),
                seconds = this.$el.find('.seconds').val(),
                seconds00 = seconds.substr(seconds.length - 2),
                secondInt = parseInt(seconds00, 10),
                val;

            if (am_pm == "PM") {
                hourInt = hourInt < 12 ? hourInt + 12 : 12;
                hours00 = String(hourInt);
            } else {
                if (hourInt < 10) {
                    hours00 = "0" + String(hourInt);
                } else if (hourInt == 12) {
                    hours00 = "00";
                }
            }

            if (minuteInt < 10) {
                minutes00 = "0" + String(minuteInt);
            } else if (minuteInt == 0) {
                minutes00 = "00";
            }

            if (secondInt < 10) {
                seconds00 = "0" + String(secondInt);
            } else if (secondInt == 0) {
                seconds00 = "00";
            }

            if (dateStr === ''){
                return null;
            }

            if (date === '1969-12-31') {
                return '';
            }

            val = date + "T" + hours00 + ":" + minutes00 + ":" + seconds00;
            console.log('getValue:', val);
            return val;
        },
        render: function () {
            Backbone.Form.editors.Base.prototype.render.apply(this, arguments);
            var that = this;
            this.picker = new Pikaday({
                field: this.$el.find('.datepicker')[0],
                format: this.format,
                blurFieldOnSelect: false,
                defaultDate: this.$el.find('.datepicker').val(),
                onSelect: function (date, format) {
                },
                toString: function (date, format) {
                    var s = dateFns.format(date, format);
                    if (s === '1969-12-31') {
                        return "";
                    }
                    return s;
                }
            });
            //this.picker.setDate(this.value);
            return this;
        }
    });

    Backbone.Form.editors.MediaEditor = Backbone.Form.editors.Base.extend({

        events: {
            'click #add-media-button': 'showMediaBrowser',
            'click .detach_media': 'detachModel'
        },

        tagName: "div",

        initialize: function (options) {
            Backbone.Form.editors.Base.prototype.initialize.call(this, options);
            this.app = this.form.app;
            this.listenTo(this.model, 'add-models-to-marker', this.attachModels);
            var template = Handlebars.compile(MediaTemplate);
            this.$el.append(template({
                children: this.value
            }));
        },
        attachModels: function (models) {
            var errors = this.form.commit({ validate: true }),
                that = this;
            if (errors) {
                console.log("errors: ", errors);
                return;
            }
            this.model.save(null, {
                success: function () {
                    that.attachMedia(models);
                }
            });
            this.app.vent.trigger('hide-modal');
        },
        /*
        * Attach Media and Detach Model calls the following that causes
        * the current unsaved values of fields in HTML form to be reset to stored values:
        *
        * that.model.fetch({reset: true});
        */
        attachMedia: function (models) {
            var that = this,
                i,
                ordering,
                fetch = function () {
                    that.model.fetch({reset: true});
                };
            for (i = 0; i < models.length; ++i) {
                ordering = this.model.get("photo_count") + this.model.get("audio_count");
                this.model.attach(models[i], (ordering + i + 1));
            }
            //fetch and re-render model:
            if (models.length > 0) { setTimeout(fetch, 800); }
        },
        detachModel: function (e) {
            var $elem = $(e.target),
                attachmentType = $elem.attr("data-type"),
                attachmentID = $elem.attr("data-id"),
                name = $elem.attr("media-name");
            if (!confirm("Are you sure you want to detach " +
                    name + " from this site? Note that this will not delete the media file -- it just detaches it.")) {
                return;
            }
            var errors = this.form.commit({ validate: true }),
                that = this,
                isNew = this.model.get("id") ? false : true;
            if (errors) {
                console.log("errors: ", errors);
                return;
            }
            this.model.save(null, {
                success: function () {
                    that.model.detach(attachmentType, attachmentID, function () {
                        that.model.fetch({reset: true});
                    });
                }
            });
        },
        showMediaBrowser: function (e) {
            var addMediaLayoutView = new AddMedia({
                app: this.app,
                parentModel: this.model
            });
            this.app.vent.trigger("show-modal", {
                title: 'Media Browser',
                width: 1100,
                height: 400,
                view: addMediaLayoutView,
                saveButtonText: "Add",
                showSaveButton: true,
                saveFunction: addMediaLayoutView.addModels.bind(addMediaLayoutView),
            });
            addMediaLayoutView.showUploader();
            e.preventDefault();
        },
        getValue: function () {
            return null;
        },
        render: function () {
            Backbone.Form.editors.Base.prototype.render.apply(this, arguments);
            this.renderAudioPlayers();
            this.enableMediaReordering();
            return this;
        },
        renderAudioPlayers: function () {
            var audio_attachments = [],
                that = this,
                player,
                $elem;
            if (this.model.get("children") && this.model.get("children").audio) {
                audio_attachments = this.model.get("children").audio.data;
            }
            _.each(audio_attachments, function (item) {
                $elem = that.$el.find(".audio-basic[data-id='" + item.id + "']")[0];
                player = new AudioPlayer({
                    model: new Audio(item),
                    audioMode: "basic",
                    app: that.app
                });
                $elem.append(player.$el[0]);
            });
        },
        enableMediaReordering: function () {
            var sortableFields = this.$el.find(".attached-media-container"),
                that = this,
                newOrder,
                attachmentType,
                attachmentID,
                association;
            sortableFields.sortable({
                helper: this.fixHelper,
                items : '.attached-container',
                update: function (event, ui) {
                    newOrder = ui.item.index();
                    attachmentType = ui.item.find('.detach_media').attr("data-type");
                    attachmentID = ui.item.find('.detach_media').attr("data-id");
                    association = new Association({
                        model: that.model,
                        attachmentType: attachmentType,
                        attachmentID: attachmentID
                    });
                    association.save({ ordering: newOrder}, {patch: true});
                }
            }).disableSelection();
        },

        fixHelper: function (e, ui) {
            //not sure what this does:
            ui.children().each(function () {
                $(this).width($(this).width());
            });
            return ui;
        }
    });
});
