/**
  The MouseMover's only job is to follow the mouse and return an X, Y coordinate
  when the user clicks the map. Triggers a 'point-complete' event to return the
  X-Y coordinate.
*/
define(['jquery', 'handlebars', 'lib/maps/overlays/icon'], function ($, Handlebars, Icon) {
    const MouseMover = function (event, opts) {
        this.color = '#ed867d';
        this.size = 35;
        this.app = opts.app;
        const $follower = $('<div id="follower"></div>');
        $('body').append($follower);

        this.initialize = (event) => {
            $follower.css({
                top: event.clientY - this.size * 3 / 4 + 4,
                left: event.clientX - this.size * 3 / 4,
                display: 'block'
            });
            $(window).mousemove(this.start.bind(this));
            $follower.click(this.stop);
        };

        this.generateIcon = () => {
            const template = Handlebars.compile(`
                <svg viewBox="{{ viewBox }}" width="{{ width }}" height="{{ height }}">
                    <path fill="{{ fillColor }}" paint-order="stroke" stroke-width="{{ strokeWeight }}" stroke-opacity="0.5" stroke="{{ fillColor }}" d="{{ path }}"></path>
                </svg>`);
            console.log(template);
            const shape = "marker";
            this.icon = new Icon({
                shape: shape,
                strokeWeight: 6,
                fillColor: this.color,
                width: this.size,
                height: this.size
            }).generateGoogleIcon();
            $follower.html(template(this.icon));
            $follower.show();
        };

        this.start = () => {
            this.generateIcon();
            $(window).bind('mousemove', this.mouseListener);
        };

        this.stop = (event) => {
            $(window).unbind('mousemove');
            $follower.remove();
            this.app.vent.trigger("point-complete", {
                x: event.clientX,
                y: event.clientY
            });
        };

        this.mouseListener = (event) => {
            $follower.css({
                top: event.clientY - this.icon.height * 3 / 4 + 4,
                left: event.clientX - this.icon.width * 3 / 4
            });
        };

        //call initialization function:
        this.initialize(event);
    };
    return MouseMover;
});
