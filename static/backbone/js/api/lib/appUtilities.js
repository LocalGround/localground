/**AppUtilities defines a set of mixin properties that perform many of the same functions as the old
 *'sb' object, minus event aggregation.  I'm separating it out into this file just to keep track of what
 *to keep a centralized record of these function to perhaps remove later (possibly getMap/setMap, things
 *like that
 */
define(["jquery"],
    function ($) {
        "use strict";
        return {
            saveState: function (key, obj, replace) {
                this.saveToLocalStorage(key, obj, replace);
            },
            restoreState: function (key) {
                return this.getFromLocalStorage(key);
            },
            getFromLocalStorage: function (key) {
                var cache = localStorage.mapplication;
                if (!cache) { return null; }
                try {
                    cache = JSON.parse(cache);
                } catch (e) {
                    return null;
                }
                return cache[key];
            },
            saveToLocalStorage: function (key, object, replace) {
                var cache = localStorage.mapplication;
                cache = !cache ? {} : JSON.parse(cache);
                cache[key] = cache[key] || {};
                if (replace) {
                    cache[key] = object;
                } else {
                    $.extend(cache[key], object);
                }
                localStorage.mapplication = JSON.stringify(cache);
            },
            setMap: function (map) {
                //not sure if this makes sense to do here
                this.map = map;
            },
            getMap: function () {
                //not sure if this makes sense to do here
                return this.map;
            },
            setMode: function (mode) {
                this.mode = mode;
                this.vent.trigger('mode-change');
            },
            getMode: function () {
                return this.mode;
            },
            setActiveProjectID: function (projectID) {
                this.activeProjectID = projectID;
            },
            getActiveProjectID: function () {
                return this.activeProjectID;
            },
            setOverlayView: function (overlayView) {
                this.overlayView = overlayView;
            },
            getOverlayView: function () {
                return this.overlayView;
            }

        };
    });
