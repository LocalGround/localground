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
                //console.log(cache);
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
            },
            csrfSafeMethod: function (method) {
                // these HTTP methods do not require CSRF protection
                return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
            },
            sameOrigin: function (url) {
                // test that a given url is a same-origin URL
                // url could be relative or scheme relative or absolute
                var host = document.location.host,
                    protocol = document.location.protocol,
                    sr_origin = '//' + host,
                    origin = protocol + sr_origin;
                // Allow absolute or scheme relative URLs to same origin
                return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
                    (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
                    // or any other URL that isn't scheme relative or absolute i.e relative.
                    !(/^(\/\/|http:|https:).*/.test(url));
            },
            setCsrfToken: function (xhr, settings) {
                if (!this.csrfSafeMethod(settings.type) && this.sameOrigin(settings.url)) {
                    var csrf = this.getCookie('csrftoken');
                    xhr.setRequestHeader("X-CSRFToken", csrf);
                }
            },
            getCookie: function (name) {
                var cookieValue, cookies, i, cookie;
                if (document.cookie && document.cookie != '') {
                    cookies = document.cookie.split(';');
                    for (i = 0; i < cookies.length; i++) {
                        cookie = $.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            },
            showLoadingMessage: function () {
                $('#loading_message').show();
            },
            hideLoadingMessage: function () {
                $('#loading_message').hide();
            },
            handleDatabaseError: function (options, response) {
                var responseJSON,
                    message = "";
                try {
                    responseJSON = JSON.parse(response.responseText);
                    message = responseJSON.non_field_errors[0];
                } catch (e) {
                    message = "Unknown error";
                }
                options.app.vent.trigger('database-error', {
                    message: message
                });
            },
            initAJAX: function (options) {
                // adding some global AJAX event handlers for showing messages and
                // appending the Django authorization token:
                var that = this;
                $.ajaxSetup({
                    beforeSend: function (xhr, settings) {
                        that.showLoadingMessage();
                        that.setCsrfToken(xhr, settings);
                    },
                    complete: this.hideLoadingMessage,
                    statusCode: {
                        400: that.handleDatabaseError.bind(undefined, options),
                        401: that.handleDatabaseError.bind(undefined, options),
                        500: that.handleDatabaseError.bind(undefined, options)
                    }
                });
            }
        };
    });
