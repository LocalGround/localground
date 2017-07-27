define(["models/base", "jquery"], function (Base, $) {
    "use strict";
    /**
     * A Backbone Model class for the Photo datatype.
     * @class Photo
     * @see <a href="//localground.org/api/0/photos/">//localground.org/api/0/photos/</a>
     */
    var Photo = Base.extend({
        schema: {
            name: { type: 'TextArea', title: "Name" },
            caption:  { type: 'TextArea', title: "Caption" },
            attribution: { type: 'TextArea', title: "Attribution" },
            tags: { type: 'List', itemType: 'Text' }
        },
        rotate: function (direction, callback) {
            $.ajax({
                url: '/api/0/photos/' + this.id + '/rotate-' + direction + '/.json',
                type: 'PUT',
                success: function (data) {
                    console.log('callback!!!!');
                    this.set(data);
                    callback();
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
