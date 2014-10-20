/**AppUtilities defines a set of mixin properties that perform many of the same functions as the old
 *'sb' object, minus event aggregation.  I'm separating it out into this file just to keep track of what
 *to keep a centralized record of these function to perhaps remove later (possibly getMap/setMap, things
 *like that
 */
define(["jquery"],
    function ($) {
        "use strict";
        return {
            saveState: function (id, obj, replace) {
                this.saveToLocalStorage(id, obj, replace);
            },
            restoreState: function (module_selector, key) {
                this.getFromLocalStorage(module_selector, key);
            },
            getFromLocalStorage: function (mod, key) {
                var cache = localStorage['map-editor'];
                if (cache === null) { return null; }
                cache = JSON.parse(cache);
                if (key && cache[mod]) { return cache[mod][key]; }
                return cache[mod];
            },
            saveToLocalStorage: function (mod, object, replace) {
                var cache = localStorage['map-editor'];
                cache = cache !== null ? JSON.parse(cache) : {};
                cache[mod] = cache[mod] || {};
                if (replace) {
                    cache[mod] = object;
                } else {
                    $.extend(cache[mod], object);
                }
                localStorage['map-editor'] = JSON.stringify(cache);
                    //this.log(1, JSON.stringify(cache));
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
