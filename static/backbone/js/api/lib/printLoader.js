/**
 * Created by zmmachar on 12/17/14.
 */
define(["collections/projects",
        "jquery",
        "config"
    ],
    function (Projects, $, Config) {
        'use strict';

        /**
         * The Printloader class handles loading data for the print generation form
         * @class PrintLoader
         */
        var PrintLoader = function (opts) {

            this.initialize = function (opts) {
                this.app = opts.app;
                this.projectCollection = opts.availableProjects;
                this.projectCollection.fetch({reset: true});

            };

            this.initialize(opts);
        };
        return PrintLoader;
    });
