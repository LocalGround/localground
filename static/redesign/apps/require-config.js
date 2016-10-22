require.config({
    baseUrl: "/static/redesign",
    paths: {
        'backbone': 'external/backbone-min',
        'backbone-bootstrap-modal': 'external/backbone.bootstrap-modal',
        'backbone.localStorage': '../backbone.localStorage-min',
        'backbone-pageable': 'external/backbone-pageable',
        'backbone-paginator': 'external/backbone.paginator',
        'backgrid': 'external/backgrid.min',
        'backgrid-paginator': 'external/backgrid-paginator-svw-debugged',
        'boot': 'external/jasmine-2.1.3/boot-forked',
        //'bootstrap-form-templates': 'external/backbone-forms-bootstrap3-templates',
        'colResizable': 'lib/tables/colResizeableMod',
        'color-picker': 'external/jscolor',
        'core': 'external/mediator/core-jquery',
        'form': '//libraries.cdnhttps.com/ajax/libs/backbone-forms/0.14.0/backbone-forms',
        'list': 'external/list.min',
        'google-infobubble': 'external/infobubble',
        'handsontable': 'http://docs.handsontable.com/0.16.1/bower_components/handsontable/dist/handsontable.full',
        'jasmine': 'external/jasmine-2.1.3/jasmine',
        'jasmine-html': 'external/jasmine-2.1.3/jasmine-html',
        'jasmine-jquery': 'external/jasmine-2.1.3/jasmine-jquery',
        'handlebars': '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min',
        'highcharts': '//code.highcharts.com/highcharts',
        'highcharts_export': '//code.highcharts.com/modules/exporting',
        'jquery': '//code.jquery.com/jquery-1.8.0.min',
        'jquery.bootstrap': '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min',
        'jquery.ui': '//code.jquery.com/ui/1.11.4/jquery-ui.min',
        'kernel': 'external/kernel.min',
        'mapplication': './mapplication',
        'print_base': "./print_base",
        'marionette': 'external/backbone.marionette',
        'sandbox': 'external/mediator/sandbox',
        'slick': 'external/slick.min',
        'text': 'external/text',
        'underscore': 'external/underscore-min',
        'urlon': 'external/urlon',
        'socketio': 'external/socket.io'
    },
    //waitSeconds: 0,
    shim: {
        'underscore': {
            exports: "_"
        },
        'backbone': {
            deps: [ "jquery", "underscore" ],
            exports: "Backbone"
        },
        marionette: {
            deps: ["backbone"],
            exports: "Marionette"
        },
        'jquery.bootstrap': {
            deps: ['jquery']
        },
        'jquery.ui': ['jquery'],
        'backgrid': {
            deps: ['backbone'],
            exports: 'Backgrid'
        },
        'form': {
            deps: [ "backbone" ],
            exports: "Backbone"
        },
        'bootstrap-form-templates': {
            deps: ['form']
        },
        'backbone-bootstrap-modal': {
            deps: ['backbone', 'jquery.bootstrap']
        },
        'colResizable': {
            deps: ['jquery'],
            exports: 'colResizable'
        },
        'slick': {
            deps: ['jquery']
        },
        'highcharts_export': {
            deps: ['highcharts']
        },
        'backbone.localStorage': {
            deps: ['backbone'],
            exports: 'Backbone'
        },
        jasmine: {
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        },
        'jasmine-jquery': {
            deps: ['jquery', 'jasmine'],
            exports: 'jasmine'
        },
        'boot': {
            deps: ['jasmine', 'jasmine-html'],
            exports: 'window.jasmineRequire'
        },
        'socketio': {
            exports: 'io'
        }
    },
    urlArgs: "bust=" + (new Date()).getTime()
});

function getUrlParameter(sParam) {
    "use strict";
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
    return null;
}


