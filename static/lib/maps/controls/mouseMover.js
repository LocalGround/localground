define(['handlebars', 'lib/maps/overlays/icon'], function (Handlebars, Icon) {
    const MouseMover = function ($follower, opts) {
        this.color = '#ed867d';
        this.size = 35;
        this.model = opts.model;
        this.app = opts.app;
        this.generateIcon = () => {
            const template = Handlebars.compile(`
                <svg viewBox="{{ viewBox }}" width="{{ width }}" height="{{ height }}">
                    <path fill="{{ fillColor }}" paint-order="stroke" stroke-width="{{ strokeWeight }}" stroke-opacity="0.5" stroke="{{ fillColor }}" d="{{ path }}"></path>
                </svg>`);
            let shape = this.model.get("overlay_type");
            if (shape.indexOf("form_") != -1) {
                shape = "marker";
            }
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
            this.app.vent.trigger("place-marker", {
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
    };
    return MouseMover;
});
