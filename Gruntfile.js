module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
	    requirejs: {
	        home: {
                options: {
                    out: './static/build/home.js',
                    baseUrl: "./static/",
                    mainConfigFile: "./static/apps/require-config.js",
                    name: 'apps/home/kickoff',
                    removeCombined: 'true',
                    findNestedDependencies: 'true',
                    wrapShim: 'true',
                    optimize: 'none'
                }
	        },
            main: {
                options: {
                    out: './static/build/main.js',
                    baseUrl: "./static/",
                    mainConfigFile: "./static/apps/require-config.js",
                    name: 'apps/main/kickoff',
                    removeCombined: 'true',
                    findNestedDependencies: 'true',
                    wrapShim: 'true',
                    optimize: 'none'
                }
	        },
            presentation: {
                options: {
                    out: './static/build/presentation.js',
                    baseUrl: "./static/",
                    mainConfigFile: "./static/apps/require-config.js",
                    name: 'apps/presentation/kickoff',
                    removeCombined: 'true',
                    findNestedDependencies: 'true',
                    wrapShim: 'true',
                    optimize: 'none'
                }
	        }
		},

		uglify: {
			home: {
				files: {
                    './static/build/home.min.js':
						['./static/build/home.js']
				}
			},
            main: {
                files: {
                    './static/build/main.min.js':
						['./static/build/main.js']
				}
	        },
			presentation: {
				files: {
                    './static/build/presentation.min.js':
						['./static/build/presentation.js']
				}
			}
		}

    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.registerTask('default', ['requirejs', 'uglify'])

};


/*
$ npm install  // installs package.json file
$ grunt
*/
