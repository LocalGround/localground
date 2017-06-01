define([
    "backbone",
    "handlebars",
    //"https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.js",
    "https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.0/pikaday.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/date-fns/1.28.5/date_fns.min.js",
    "text!../forms/templates/editor-templates.html",
    "form"
], function (Backbone, Handlebars, Pikaday, dateFns, EditorTemplate) {
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
            Backbone.Form.editors.Text.prototype.initialize.call(this, options);
            var template = Handlebars.compile(EditorTemplate);
            this.$el.append(template({
                dateString: dateFns.format(this.value, 'YYYY-MM-DD'),
                hoursString: dateFns.format(this.value, 'hh'),
                minutesString: dateFns.format(this.value, 'mm'),
                secondsString: dateFns.format(this.value, 'ss')
            }));
            /*//d.getMonth().toString() + "/" + d.getDate().toString() + "/" + d.getFullYear().toString();
            this.$el.append($("<input class='datepicker input-small-custom' />").val(this.dateString));
            //combine all the times together and make the CSS nice:
            this.$el.append($("<br><label>h</label><input class='hours' />").val(this.hoursString));
            this.$el.append($("<label>m</label><input class='minutes' />").val(this.minutesString));
            this.$el.append($("<label>s</label><input class='seconds' />").val(this.secondsString));*/
        },
        getValue: function () {
            //contatenate the date and time input values
            var date = this.$el.find('.datepicker').val(),
                hours = this.$el.find('.hours').val(),
                hours00 = hours.substr(hours.length - 2, hours.length - 1),
                minutes = this.$el.find('.minutes').val(),
                minutes00 = minutes.substr(minutes.length - 2, minutes.length - 1),
                seconds = this.$el.find('.seconds').val(),
                seconds00 = seconds.substr(seconds.length - 2, seconds.length - 1);
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
});
