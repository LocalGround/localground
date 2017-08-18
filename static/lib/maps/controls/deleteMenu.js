define(["underscore"], function (_) {
    "use strict";
    /**
     * Class that lets a user delete a selected vertex of a path.
     * @class DeleteMenu
     * @param {Application} app
     * The controller's sandbox interface
     */
    var DeleteMenu = function () {
        this.div_ = document.createElement('div');
        this.div_.className = 'delete-menu';
        this.div_.innerHTML = 'Delete';

        this.initialize.apply(this, arguments);
    };
    DeleteMenu.prototype = new google.maps.OverlayView();
    _.extend(DeleteMenu.prototype, {

        onAdd: function () {
            var deleteMenu = this,
                map = this.app.getMap();
            this.getPanes().floatPane.appendChild(this.div_);

            // mousedown anywhere on the map except on the menu div will close the
            // menu.
            this.divListener_ = google.maps.event.addDomListener(map.getDiv(), 'mousedown', function (e) {
                if (e.target !== deleteMenu.div_) {
                    deleteMenu.close();
                }
            }, true);
        },
        onRemove: function () {
            google.maps.event.removeListener(this.divListener_);
            this.div_.parentNode.removeChild(this.div_);

            // clean up
            this.set('position');
            this.set('path');
            this.set('vertex');
        },

        close: function () {
            this.setMap(null);
        },

        draw: function () {
            var position = this.get('position'),
                projection = this.getProjection();
            if (!position || !projection) {
                return;
            }

            var point = projection.fromLatLngToDivPixel(position);
            this.div_.style.top = point.y + 'px';
            this.div_.style.left = point.x + 'px';
        },

        /**
         * Opens the menu at a vertex of a given path.
         */
        open: function (data) {
            this.set('position', data.googleOverlay.getPath().getAt(data.point));
            this.set('overlay', data.googleOverlay);
            this.set('path', data.googleOverlay.getPath());
            this.set('vertex', data.point);
            this.setMap(this.app.getMap());
            this.draw();
        },

        /**
         * Deletes the vertex from the path.
         */
        removeVertex: function () {
            var overlay = this.get('overlay'),
                path = this.get('path'),
                vertex = this.get('vertex'),
                notenoughpoints = path.getLength() <= 2;
            if (overlay.getPaths) {
                notenoughpoints = path.getLength() <= 3;
            }
            if (!path || vertex === undefined || notenoughpoints) {
                this.close();
                return;
            }

            path.removeAt(vertex);
            this.close();
        },

        initialize: function (opts) {
            this.app = opts.app;
            this.app.vent.on('show-delete-menu', this.open.bind(this));
            var menu = this;
            google.maps.event.addDomListener(this.div_, 'click', function () {
                menu.removeVertex();
            });
        },

        destroy: function () {
            this.setMap(null);
        }
    });
    return DeleteMenu;
});

