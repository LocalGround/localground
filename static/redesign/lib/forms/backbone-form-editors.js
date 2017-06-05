define([
    "backbone",
    "handlebars",
    "models/association",
    "https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.0/pikaday.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/date-fns/1.28.5/date_fns.min.js",
    "text!../forms/templates/date-time-template.html",
    "text!../forms/templates/media-editor-template.html",
    "form"
], function (Backbone, Handlebars, Association, Pikaday, dateFns, DateTimeTemplate, MediaTemplate) {
    "use strict";
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

        initialize: function (options) {
            // add date / time validator before calling the
            // parent initialization function:
            options.schema.validators = [this.dateTimeValidator];
            Backbone.Form.editors.Text.prototype.initialize.call(this, options);
            var template = Handlebars.compile(DateTimeTemplate);
            var hours = parseInt(dateFns.format(this.value, 'HH'));
            var isPm = hours >= 12 ? true: false;
            this.$el.append(template({
                dateString: dateFns.format(this.value, 'YYYY-MM-DD'),
                hoursString: dateFns.format(this.value, 'hh'),
                minutesString: dateFns.format(this.value, 'mm'),
                secondsString: dateFns.format(this.value, 'ss'),
                am_pm_String: dateFns.format(this.value, 'a'),
                hours: hours,
                isPm: isPm
            }));
        },
        dateTimeValidator: function (value, formValues) {


            try {
                console.log(value);
                var d = new Date(value);
                if (d == "Invalid Date"){
                    return {
                        type: 'date',
                        message: 'Invalid date / time value. Please try again.'
                    };
                }
                console.log(d);

            } catch (ex) {
                console.log(value);
                console.log(ex);
                return {
                    type: 'date',
                    message: 'Invalid date / time value. Please try again.'
                };
            }
            return null;
        },
        getValue: function () {
            //contatenate the date and time input values
            var date = this.$el.find('.datepicker').val(),
                am_pm = this.$el.find('.am_pm').val(),
                hours = this.$el.find('.hours').val(),
                hours00 = hours.substr(hours.length - 2),
                minutes = this.$el.find('.minutes').val(),
                minutes00 = minutes.substr(minutes.length - 2),
                seconds = this.$el.find('.seconds').val(),
                seconds00 = seconds.substr(seconds.length - 2);

            if (am_pm == "PM"){
                var hourInt = parseInt(hours00);
                hourInt = hourInt < 12? hourInt + 12: 12;
                hours00 = String(hourInt);
            } else {
                var hourInt = parseInt(hours00);
                if (hourInt < 10){
                    hours00 = "0" + String(hourInt);
                } else if (hourInt == 12){
                    hours00 == "00";
                }
            }

            return date + "T" + hours00 + ":" + minutes00+ ":" + seconds00;
        },
        render: function () {
            Backbone.Form.editors.Base.prototype.render.apply(this, arguments);
            var picker = new Pikaday({
                field: this.$el.find('.datepicker')[0],
                format: "YYYY-MM-DD",
                toString: function (date, format) {
                    return dateFns.format(date, format);
                }
            });
            return this;
        }
    });

    Backbone.Form.editors.MediaEditor = Backbone.Form.editors.Base.extend({

        tagName: "div",

        initialize: function (options) {
            // add date / time validator before calling the
            // parent initialization function:
            Backbone.Form.editors.Base.prototype.initialize.call(this, options);
            var template = Handlebars.compile(MediaTemplate);
            this.$el.append(template({
                children: this.value
            }));
        },
        getValue: function () {
            return null;
        },
        render: function () {
            Backbone.Form.editors.Base.prototype.render.apply(this, arguments);
            this.enableMediaReordering();
            return this;
        },
        enableMediaReordering: function () {
            console.log(this, this.model);
            var sortableFields = this.$el.find(".attached-media-container"),
                that = this,
                newOrder,
                modelID,
                association;
            sortableFields.sortable({
                helper: this.fixHelper,
                items : '.attached-container',
                update: function (event, ui) {
                    newOrder = ui.item.index();
                    modelID = ui.item.find('.detach_media').attr('data-id');
                    association = new Association({
                        model: that.model,
                        attachmentType: "photos", //TODO: detect
                        attachmentID: modelID
                    });
                    association.save({ ordering: newOrder}, {patch: true});
                }
            }).disableSelection();
        }
    });
});
