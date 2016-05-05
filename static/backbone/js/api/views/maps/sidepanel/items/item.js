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
        /** tracks # of times this view is rendered (important for restoring state) */
        numRenderings: 0,
        state: {},

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
            'dragend .item-icon': 'dropListener',
            'drag .item-icon': 'dragListener'
        },

        modelEvents: {
            'change': 'render'
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
            this.id = 'sidebar-' + this.model.getKey() + "-" + this.model.get('id');
            this.restoreState();
            this.listenTo(this.model, 'show-item', this.showItem);
            this.listenTo(this.model, 'hide-item', this.hideItem);
            this.listenTo(this.app.vent, "mode-change", this.setEditMode);
            this.listenTo(this.model.collection, 'refresh', this.refreshItem);

            document.addEventListener('dragover', function (e) {
                e.preventDefault();
            });
            document.addEventListener('dragenter', function (e) {
                e.preventDefault();
            });

        },

        onRender: function () {
            ++this.numRenderings;
            if (this.isShowingOnMap()) {
                this.model.trigger("show-overlay");
            }
            this.setEditMode();
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
                this.model.set('showingOnMap', true);
            } else {
                this.model.set('showingOnMap', false);
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
            this.toggleElement($cb.is(':checked'));
            if (e) {
                e.stopPropagation();
            }
        },

        refreshItem: function (e) {
            this.toggleCheckbox();
        },

        /**
         * Helps the div containing the checkbox to communicate
         * with the toggleElement function.
         * @param {Event} e
         */
        triggerToggleCheckbox: function (e) {
            var $cb = this.$el.find('input');
            if ($cb.css('visibility') !== 'hidden') {
                $cb.attr('checked', !$cb.is(':checked'));
                this.toggleElement($cb.is(':checked'));
            }
            if (e) {
                e.stopPropagation();
            }
        },

        showItem: function () {
            this.checkItem();
        },

        hideItem: function () {
            this.uncheckItem();
        },

        checkItem: function () {
            this.$el.find('input').attr('checked', true);
            this.toggleElement(true);
            this.saveState();
        },

        uncheckItem: function () {
            this.$el.find('input').attr('checked', false);
            this.toggleElement(false);
            this.saveState();
        },

        isFirstRendering: function () {
            return this.numRenderings < 1;
        },

        /**
         * Helps the checkbox communicate with the toggleElement function.
         * @param {Event} e
         */
        zoomTo: function (e) {
            if (this.model.get("geometry") && this.isShowingOnMap()) {
                this.model.trigger("zoom-to-overlay");
            }
            e.stopPropagation();
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
            if (this.model.get("geometry") && this.isShowingOnMap()) {
                this.model.trigger("show-tip");
            }
        },

        /** Hide the map tooltip */
        hideTip: function () {
            this.model.trigger('hide-tip');
        },

        dropListener: function (event) {
            this.app.vent.trigger("georeference-from-div", {
                event: event,
                model: this.model
            });
        },

        dragListener: function (event) {
            if (this.model.getKey() != "markers") {
                this.app.vent.trigger("dragging-html-element", {
                    event: event
                });
            }
        },

        templateHelpers: function () {
            return {
                isShowingOnMap: this.isShowingOnMap()
            };
        },

        /**
        * Determines whether or not the item entry should be checked (i.e. that the corresponding
        * map overlay should be visible).
        */
        isShowingOnMap: function () {
            var _isShowingOnMap = this.$el.find('input').is(":checked") && this.model.get('isVisible');
            // ensures that localStorage flag is only honored on initialization.
            if (this.isFirstRendering() && this.state._isShowingOnMap) {
                _isShowingOnMap = true;
            }
            return _isShowingOnMap;
        },

        saveState: function () {
            this.app.saveState(
                this.id,
                {
                    _isShowingOnMap: this.isShowingOnMap()
                },
                false
            );
        },

        restoreState: function () {
            this.state = this.app.restoreState(this.id);
            if (!this.state) {
                this.state = { _isShowingOnMap: false };
            } else {
                this.model.set('showingOnMap', this.state._isShowingOnMap);
            }
        }
    });
    return Item;
});
