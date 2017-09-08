
var rootDir = "../../";
define([
    "handlebars",
    rootdir + "apps/dataviewer/app",
    "tests/spec-helper"
],
    function(Handlebars, DataViewerApp){
        'use strict';

        var fixture, newDataViewerApp, setupDataViewerApp;

        setupDataViewerApp = function(){
            newDataViewerApp = new DataViewerApp();
            newDataViewerApp.start()
        };

        

    };
);
