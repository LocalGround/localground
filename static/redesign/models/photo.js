define(["models/base", "jquery"], function (Base, $) {
    "use strict";
    /**
     * A Backbone Model class for the Photo datatype.
     * @class Photo
     * @see <a href="//localground.org/api/0/photos/">//localground.org/api/0/photos/</a>
     */
    var Photo = Base.extend({
        schema: {
            name: 'Text',
            caption: { type: 'TextArea'},
            tags: 'Text',
            attribution: 'Text'
        },
        getNamePlural: function () {
            return "photos";
        },
        rotate: function (direction) {
            $.ajax({
                url: '/api/0/photos/' + this.id + '/rotate-' + direction + '/.json',
                type: 'PUT',
                success: function(data) {
                    this.set(data);
                }.bind(this),
                notmodified: function(data) { console.error('Photo Not modified'); },
                error: function(data) { console.error('Error: Rotation failed'); }
            });
        },
        //be careful not to overwrite inherited defaults (but OK to extend them):
        defaults: _.extend({}, Base.prototype.defaults, {
            checked: false
        })

    });
    return Photo;
});
