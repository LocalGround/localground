define(["marionette", "jquery"], function (Marionette, $) {
    'use strict';
    /**
     * Class that controls the right-hand listing of a single
     * Backbone Model.
     * @class Item
     */
    var Item = Marionette.ItemView.extend({
        /**
         * @lends localground.maps.views.Item#
         */

        /** A rendered item template */
        template: null,

        /** A Backbone model */
        model: null,

        /**
         * A google.maps.Overlay object (Point, Polyline, Polygon,
         * or GroundOverlay)
         */
        googleOverlay: null,

        /**
         * Event listeners: Listens for delete checkbox toggle,
         * or div click (which triggers a checkbox toggle).
         */
        events: {
            "click .fa-trash-o": "deleteItem",
            'click .cb-data': 'toggleCheckbox',
            'click .data-item': 'triggerToggleCheckbox',
            'click a': 'zoomTo',
            'mouseover .data-item': 'showTip',
            'mouseout .data-item': 'hideTip',
            'click .project-item': 'triggerToggleProjectData',
            'click .cb-project': 'toggleProjectData',
            'dragend .item-icon': 'dropItem'
        },

        /**
         * Initializes the object and populates the map and
         * template properties
         * @param {Object} opts
         * Dictionary of initialization options
         * @param {Backbone.Model} opts.model: item,
         * Backbone Model
         * @param {Object} opts.template
         * Rendered templates
         * @param {Object} opts.element
         * jQuery selector element
         */
        initialize: function (opts) {
            $.extend(this, opts);
            //this.setElement(opts.el);
            this.render();
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'remove', this.remove);
            this.listenTo(this.model, 'show-item', this.showItem);
            this.listenTo(this.model, 'hide-item', this.hideItem);
            this.listenTo(this.model, 'check-item', this.checkItem);
            this.listenTo(this.model, 'uncheck-item', this.uncheckItem);
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'reset', this.render);
            this.app.vent.on("mode-change", this.setEditMode);
            document.addEventListener('dragover', function (e) {
                e.preventDefault();
            });
            document.addEventListener('dragenter', function (e) {
                e.preventDefault();
            });

        },

        /**
         * Notifies other objects (like the overlayManager)
         * who are listening for this event can take measures.
         * @param {Boolean} isChecked
         * A flag that tells the method whether to turn the overlay
         * on or off.
         */
        toggleElement: function (isChecked) {
            if (isChecked) {
                this.model.trigger("show-overlay");
            } else {
                this.model.trigger("hide-overlay");
            }
            this.saveState();
        },

        setEditMode: function () {
            var mode = this.app.getMode(),
                item = this.$el.find('.item');
            if (mode === "view") {
                item.removeClass('editable');
                item.find('.item-icon').prop('draggable', false);
            } else {
                item.addClass('editable');
                item.find('.item-icon').prop('draggable', true);
            }
        },

        /**
         * Helps the checkbox communicate with the toggleElement function.
         * @param {Event} e
         */
        toggleCheckbox: function (e) {
            var $cb = this.$el.find('input');
            this.toggleElement($cb.attr('checked'));
            e.stopPropagation();
        },

        /**
         * Helps the div containing the checkbox to communicate
         * with the toggleElement function.
         * @param {Event} e
         */
        triggerToggleCheckbox: function (e) {
            var $cb = this.$el.find('input');
            if ($cb.css('visibility') !== 'hidden') {
                $cb.attr('checked', !$cb.attr('checked'));
                this.toggleElement($cb.attr('checked'));
            }
            if (e) {
                e.stopPropagation();
            }
        },

        showItem: function () {
            this.checkItem();
            this.toggleElement(true);
        },

        hideItem: function () {
            this.uncheckItem();
            this.toggleElement(false);
        },

        checkItem: function () {
            this.$el.find('input').attr('checked', true);
            this.saveState();
        },

        uncheckItem: function () {
            this.$el.find('input').attr('checked', false);
            this.saveState();
        },

        /**
         * Triggers the checkbox event from a DIV click event
         * @param {Event} e
         */
        triggerToggleProjectData: function (e) {
            var $cb = this.$el.find('input');
            $cb.attr('checked', !$cb.attr('checked'));
            this.toggleProjectData(e);
            e.stopPropagation();

        },
        /**
         * Control that adds / removes project data within the
         * data manager
         * @param {Event} e
         */
        toggleProjectData: function (e) {
            var $cb = this.$el.find('input');
            if ($cb.prop("checked")) {
                this.app.vent.trigger('project-requested', {id: $cb.val()});
            } else {
                this.app.vent.trigger('project-removal-requested', {id: $cb.val()});
            }
            this.saveState();
            e.stopPropagation();
        },

        isVisible: function () {
            return this.$el.find('input').attr('checked') === "checked";
        },
        /**
         * Helps the checkbox communicate with the toggleElement function.
         * @param {Event} e
         */
        zoomTo: function (e) {
            if (this.model.get("geometry") && this.isVisible()) {
                this.model.trigger("zoom-to-overlay");
            }
            e.stopPropagation();
        },

        /**
         * Renders the HTML from the model
         */
        render: function () {
            //todo: restore state here:
            var opts = this.restoreState();
            $.extend(opts, this.model.toTemplateJSON());
            //for the marker model:
            if (this.model.getDescriptiveText) {
                opts.descriptiveText = this.model.getDescriptiveText();
            }
            this.$el.html(this.template(opts));
            this.setEditMode();
        },

        /**
         * Handles the "delete click." Upon confirmation, the underlying
         * model is destroyed.
         * @param {Event} e
         */
        deleteItem: function (e) {
            var answer = confirm("Are you sure you want to delete the \"" +
                (this.model.get("name") || "Untitled") + "\" " +
                this.model.get("overlay_type") + " file?");
            if (answer) {
                this.model.destroy();
            }
            e.stopPropagation();
        },

        /** Show a tooltip on the map if the geometry exists */
        showTip: function () {
            if (this.model.get("geometry") && this.isVisible()) {
                this.model.trigger("show-tip");
            }
        },

        /** Hide the map tooltip */
        hideTip: function () {
            this.app.vent.trigger('hide-tip', {model: this.model});
        },
        saveState: function () {
            this.app.saveState({
                isVisible: this.isVisible()
            });
        },

        restoreState: function () {
            var state = this.app.restoreState();
            if (!state) {
                return { isVisible: false };
            }

            return state;

        },

        destroy: function () {
            this.remove();
        },

        dropItem: function (event) {
            function elementContainsPoint(domElement, x, y) {
                return x > domElement.offsetLeft && x < domElement.offsetLeft + domElement.offsetWidth &&
                    y > domElement.offsetTop && y < domElement.offsetTop + domElement.offsetHeight;

            }


            var overlayView = this.app.getOverlayView(),
                map = this.app.getMap(),
                e = event.originalEvent,
                mapContainer = map.getDiv(),
                point,
                projection,
                latLng;
            e.stopPropagation();

            if (elementContainsPoint(mapContainer, e.pageX, e.pageY)) {
                point = new google.maps.Point(e.pageX - mapContainer.offsetLeft,
                    e.pageY - mapContainer.offsetTop);
                projection = overlayView.getProjection();
                latLng = projection.fromContainerPixelToLatLng(point);
                this.model.setGeometry(latLng);
                this.model.save();
                this.showItem();
            }
            //TODO instantiate point then add geodata to model
            //Trigger sync, then trigger display on map

        }
    });
    return Item;
});
