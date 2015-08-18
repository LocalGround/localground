define(["models/base", "jquery"], function (Base, $) {
    "use strict";
    /**
     * A Backbone Model class for the Photo datatype.
     * @class Photo
     * @see <a href="http://localground.org/api/0/photos/">http://localground.org/api/0/photos/</a>
     */
    var Photo = Base.extend({
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
        }
        
    });
    return Photo;
});
