require.config({
    baseUrl: "/static",
    paths: {
        'backbone': 'external/backbone-min',
        'backbone-bootstrap-modal': 'external/backbone.bootstrap-modal',
        'backbone.localStorage': '../backbone.localStorage-min',
        'backbone-pageable': 'external/backbone-pageable',
        'backbone-paginator': 'external/backbone.paginator',
        'backgrid': 'external/backgrid.min',
        'backgrid-paginator': 'external/backgrid-paginator-svw-debugged',
        'backbone-upload-manager': 'external/uploader/backbone.upload-manager',
        'backbone.defered-view-loader': 'external/uploader/backbone.defered-view-loader',
        'boot': 'external/jasmine-2.1.3/boot-forked',
        'colResizable': 'lib/tables/colResizeableMod',
        'color-picker': 'external/jscolor',
        'color-picker-new': 'external/jscolor-updated',
        'color-picker-eyecon': 'external/colorpicker/js/colorpicker-forked',
        'core': 'external/mediator/core-jquery',
        'form': '//cdnjs.cloudflare.com/ajax/libs/backbone-forms/0.14.1/backbone-forms.min',
        'form-list': '//cdnjs.cloudflare.com/ajax/libs/backbone-forms/0.14.1/editors/list',
        'list': 'external/list.min',
        'google-infobubble': 'external/infobubble',
        'handsontable': '//cdnjs.cloudflare.com/ajax/libs/handsontable/0.31.0/handsontable.full.min',
        'jasmine': '//cdnjs.cloudflare.com/ajax/libs/jasmine/2.5.2/jasmine.min',
        'jasmine-html': '//cdnjs.cloudflare.com/ajax/libs/jasmine/2.5.2/jasmine-html.min',
        'jasmine-jquery': 'external/jasmine-2.1.3/jasmine-jquery-forked',
        'handlebars': '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min',
        'highcharts': '//code.highcharts.com/highcharts',
        'highcharts_export': '//code.highcharts.com/modules/exporting',
        'jquery': '//code.jquery.com/jquery-1.8.0.min',
        'jquery.bootstrap': '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min',
        'jquery.ui': '//code.jquery.com/ui/1.12.1/jquery-ui.min',
        'touchPunch': 'external/jquery.ui.touch-punch.min',
        'jquery.ui.widget': 'external/jquery.ui.widget',
        //new uploader
        'jquery.fileupload-ip': 'external/jquery.fileupload-ip',
        'jquery.fileupload': 'external/jquery.fileupload',
        'load-image': 'external/load-image.min',
        'canvas-to-blob': 'external/canvas-to-blob.min',
        'kernel': 'external/kernel.min',
        'mapplication': './mapplication',
        'palette': 'external/palette',
        'print_base': "./print_base",
        //'marionette': 'https://cdnjs.cloudflare.com/ajax/libs/backbone.marionette/3.1.0/backbone.marionette.min',
        'marionette': 'external/backbone.marionette',
        //'moment': '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min',
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
        'touchPunch': ['jquery.ui'],
        'jquery.ui.widget': ['jquery.ui'],
        'jquery.fileupload': ['jquery.ui.widget'],
        'backgrid': {
            deps: ['backbone'],
            exports: 'Backgrid'
        },
        'form': {
            deps: [ "backbone" ],
            exports: "Backbone"
        },
        'form-list': {
            deps: [ "form" ],
            exports: "Backbone"
        },
        'backbone.defered-view-loader': {
            deps: ['backbone']
        },
        'backbone-upload-manager': {
            deps: [ 'backbone.defered-view-loader', 'jquery.fileupload']
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
        'color-picker-eyecon': {
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
            deps: ['jasmine', 'jasmine-html', 'jasmine-jquery'],
            exports: 'jasmine'
        },
        'socketio': {
            exports: 'io'
        }
    },
    urlArgs: "bust=" + (new Date()).getTime()
});
