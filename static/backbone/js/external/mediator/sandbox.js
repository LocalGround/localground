define([], function() {
    var Sandbox = {
        create : function (core, module_selector) { 
            //var CONTAINER = core.dom.query('#' + module_selector); 
            return {
                saveState: function(obj, replace) {
                    replace = replace || false;
                    core.saveToLocalStorage(module_selector, obj, replace);
                },
                restoreState: function(key){
                    return core.getFromLocalStorage(module_selector, key);
                },
                notify : function (evt) {
                    if(core.is_obj(evt) && evt.type) { 
                        core.triggerEvent(evt); 
                    } 
                }, 
                listen : function (evts) { 
                    if (core.is_obj(evts)) { 
                        core.registerEvents(evts, module_selector); 
                    }             
                },  
                ignore : function (evts) { 
                    if (core.is_arr(evts)) { 
                        core.removeEvents(evts, module_selector); 
                    }          
                },
                find : function (selector) { 
                    return CONTAINER.query(selector); 
                },
                loadSubmodule: function(module_id, creator, opts){
                    core.create_module(module_id, creator, opts);
                    return core.start(module_id);
                },
                setMap: function(map) {
                    //not sure if this makes sense to do here
                    core.map = map;
                },
                getMap: function() {
                    //not sure if this makes sense to do here
                    return core.map;
                },
                setMode: function(mode) {
                    core.mode = mode;
                },
                getMode: function() {
                    return core.mode;
                },
                setActiveProjectID: function(projectID) {
                    core.activeProjectID = projectID;
                },
                getActiveProjectID: function() {
                    return core.activeProjectID;
                },
                setOverlayView: function(overlayView) {
                    //not sure if this makes sense to do here
                    core.overlayView = overlayView;
                },
                getOverlayView: function() {
                    //not sure if this makes sense to do here
                    return core.overlayView;
                }
                
            } 
        }
    };
    return Sandbox;
});