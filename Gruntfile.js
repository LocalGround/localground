module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
	    requirejs: {
	        home: {
                options: {
                    out: './static/redesign/build/home.js',
                    baseUrl: "./static/redesign/",
                    mainConfigFile: "./static/redesign/apps/require-config.js",
                    name: 'apps/home/kickoff',
                    removeCombined: 'true',
                    findNestedDependencies: 'true',
                    wrapShim: 'true',
                    optimize: 'none'
                }
	        },
            gallery: {
                options: {
                    out: './static/redesign/build/gallery.js',
                    baseUrl: "./static/redesign/",
                    mainConfigFile: "./static/redesign/apps/require-config.js",
                    name: 'apps/gallery/kickoff',
                    removeCombined: 'true',
                    findNestedDependencies: 'true',
                    wrapShim: 'true',
                    optimize: 'none'
                }
	        },
            map: {
                options: {
                    out: './static/redesign/build/map.js',
                    baseUrl: "./static/redesign/",
                    mainConfigFile: "./static/redesign/apps/require-config.js",
                    name: 'apps/map/kickoff',
                    removeCombined: 'true',
                    findNestedDependencies: 'true',
                    wrapShim: 'true',
                    optimize: 'none'
                }
	        },
            style: {
                options: {
                    out: './static/redesign/build/style.js',
                    baseUrl: "./static/redesign/",
                    mainConfigFile: "./static/redesign/apps/require-config.js",
                    name: 'apps/style/kickoff',
                    removeCombined: 'true',
                    findNestedDependencies: 'true',
                    wrapShim: 'true',
                    optimize: 'none'
                }
	        },
	        spreadsheet: {
                options: {
                    out: './static/redesign/build/spreadsheet.js',
                    baseUrl: "./static/redesign/",
                    mainConfigFile: "./static/redesign/apps/require-config.js",
                    name: 'apps/spreadsheet/kickoff',
                    removeCombined: 'true',
                    findNestedDependencies: 'true',
                    wrapShim: 'true',
                    optimize: 'none'
                }
	        },
            presentation: {
                options: {
                    out: './static/redesign/build/presentation.js',
                    baseUrl: "./static/redesign/",
                    mainConfigFile: "./static/redesign/apps/require-config.js",
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
                    './static/redesign/build/home.min.js':
						['./static/redesign/build/home.js']
				}
			},
            gallery: {
				files: {
                    './static/redesign/build/gallery.min.js':
						['./static/redesign/build/gallery.js']
				}
			},
            map: {
				files: {
                    './static/redesign/build/map.min.js':
						['./static/redesign/build/map.js']
				}
			},
            /*style: {
				files: {
                    './static/redesign/build/style.min.js':
						['./static/redesign/build/style.js']
				}
			},*/
			spreadsheet: {
				files: {
                    './static/redesign/build/spreadsheet.min.js':
						['./static/redesign/build/spreadsheet.js']
				}
			},
			presentation: {
				files: {
                    './static/redesign/build/presentation.min.js':
						['./static/redesign/build/presentation.js']
				}
			}
		}

    });
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['requirejs', 'uglify']);
};


/*
#sudo apt-get install nodejs
#sudo apt-get install npm
#sudo npm install -g grunt-cli
#sudo ln -s /usr/bin/nodejs /usr/bin/node
cd /localground
npm update -g npm
npm install
grunt
*/
