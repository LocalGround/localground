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
            style: {
                options: {
                    out: './static/build/style.js',
                    baseUrl: "./static/",
                    mainConfigFile: "./static/apps/require-config.js",
                    name: 'apps/style/kickoff',
                    removeCombined: 'true',
                    findNestedDependencies: 'true',
                    wrapShim: 'true',
                    optimize: 'none'
                }
	        },
	        dataviewer: {
                options: {
                    out: './static/build/dataviewer.js',
                    baseUrl: "./static/",
                    mainConfigFile: "./static/apps/require-config.js",
                    name: 'apps/dataviewer/kickoff',
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
            //Note: minification doesn't work for ES6. Need a transpiler
            // task
            /*style: {
				files: {
                    './static/build/style.min.js':
						['./static/build/style.js']
				}
			},
			dataviewer: {
				files: {
                    './static/build/dataviewer.min.js':
						['./static/build/dataviewer.js']
				}
			},
			presentation: {
				files: {
                    './static/build/presentation.min.js':
						['./static/build/presentation.js']
				}
			}*/
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
