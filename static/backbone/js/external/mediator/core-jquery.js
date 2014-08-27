define(['jquery', 'sandbox'], function(jQuery, Sandbox) {
    
    var CORE = (function () {
        /** a self-executing function
         */
        
        //like the database behind your webapp.
        var moduleData = {};
        debug = true;
        
        this.to_s = function(anything){
            return Object.prototype.toString.call(anything);
        };
        
        return {
            debug: function(on){
                debug = on ? true : false;    
            },
            create_module: function (moduleID, creator, opts) { 
                var temp;
                opts = opts || {};
                if (typeof moduleID === 'string' && typeof creator === 'function') {
                    if( creator.prototype.destroy && typeof creator.prototype.destroy === 'function') {
                        moduleData[moduleID] = { 
                            create : creator, 
                            instance : null,
                            initOpts: opts
                        };
                    }
                    else {
                        this.log(1, "Module \"" + moduleID + "\" Registration: FAILED: \
                                    instance has no destroy functions"); 
                    }
                }
                else {
                    this.log(1, "Module \"" + moduleID +  "\" Registration: FAILED: \
                                    one or more arguments are of incorrect type" );     
                }
            },
            start : function (moduleID) { 
                var mod = moduleData[moduleID];
                if (mod) { 
                    mod.instance = new mod.create(Sandbox.create(this, moduleID), mod.initOpts); 
                } 
            }, 
            start_all : function () { 
                var moduleID; 
                for (moduleID in moduleData) { 
                    if (moduleData.hasOwnProperty(moduleID)) { 
                        this.start(moduleID); 
                    } 
                } 
            },
            stop : function (moduleID) { 
                var data; 
                if (data == moduleData[moduleId] && data.instance) { 
                    data.instance.destroy(); 
                    data.instance = null; 
                } else { 
                    this.log(1, "Stop Module '" + moduleID + "': FAILED : \
                                module does not exist or has not been started"); 
                } 
            }, 
            stop_all : function () { 
                var moduleID; 
                for (moduleID in moduleData) { 
                    if (moduleData.hasOwnProperty(moduleID)) { 
                        this.stop(moduleID); 
                    } 
                } 
            },
            registerEvents : function (evts, mod) { 
                if (this.is_obj(evts) && mod) { 
                    if (moduleData[mod]) {
                        if (moduleData[mod].events == null) {
                            moduleData[mod].events = evts;
                        }
                        else {
                            $.extend(moduleData[mod].events, evts);
                        }
                        
                        this.log(1, moduleData);
                    } else { 
                        this.log(1, "mod \"" + mod + "\" not found"); 
                    } 
                } else { 
                    this.log(1, "module is null"); 
                } 
            }, 
            triggerEvent : function (evt) { 
                var mod; 
                for (key in moduleData) { 
                    if (moduleData.hasOwnProperty(key)){
                        mod = moduleData[key];
                        if (mod.events && mod.events[evt.type] && mod.instance) {
                            //bind the function to the calling instance:
                            mod.events[evt.type].call(mod.instance, evt.data);
                            //mod.events[evt.type](evt.data); 
                        }
                    } 
                } 
            }, 
            removeEvents : function (evts, mod) { 
                var i = 0, evt; 
                if (this.is_arr(evts) && mod && (mod = moduleData[mod]) && mod.events) { 
                    for ( ; evt = evts[i++] ; ) { 
                        delete mod.events[evt]; 
                    } 
                } 
            },
            log : function (severity, message) {
                if (debug) { 
                    console[ (severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message); 
                } else { 
                    // send to the server 
                }      
            },      
            is_arr : function (arr) { 
                return jQuery.isArray(arr);          
            }, 
            is_obj : function (obj) { 
                return jQuery.isPlainObject(obj);          
            },
            dom : {
                //called by "CORE.dom.query"
                query : function (selector, context) { 
                    var ret = {}, that = this, jqEls, i = 0; 
                    if (context && context.find) { 
                        jqEls = context.find(selector); 
                    } else { 
                        jqEls = jQuery(selector); 
                    } 
                    ret = jqEls.get(); 
                    ret.length = jqEls.length; 
                    ret.query = function (sel) { 
                        return that.query(sel, jqEls); 
                    } 
                    return ret; 
                },
                bind : function (element, evt, fn) { 
                    if (element && evt) { 
                        if (typeof evt === 'function') { 
                            efn = evt; 
                            vt = 'click'; 
                        } 
                        jQuery(element).bind(evt, fn); 
                    } else { 
                         // log wrong arguments 
                    } 
                }, 
                unbind : function (element, evt, fn) { 
                    if (element && evt) { 
                         if (typeof evt === 'function') { 
                            fn = evt; 
                            evt = 'click'; 
                        } 
                        jQuery(element).unbind(evt, fn); 
                    } else { 
                        // log wrong arguments 
                    } 
                },
                create: function (el) { 
                    return document.createElement(el);         
                }, 
                apply_attrs: function (el, attrs) { 
                    jQuery(el).attr(attrs);              
                }
            },
            saveToLocalStorage: function(mod, object, replace){
                var cache = localStorage['map-editor'];
                cache = cache != null ? JSON.parse(cache) : {};
                cache[mod] = cache[mod] || {};
                if (replace)
                    cache[mod] = object;
                else
                    $.extend( cache[mod], object);
                localStorage['map-editor'] = JSON.stringify(cache);
                this.log(1, JSON.stringify(cache));
            },
            getFromLocalStorage: function(mod, key) {
                var cache = localStorage['map-editor'];
                if (cache == null) { return null; }
                cache = JSON.parse(cache);
                if(key && cache[mod]) { return cache[mod][key]; }
                return cache[mod];
            }
        };
    }());
    return CORE
});