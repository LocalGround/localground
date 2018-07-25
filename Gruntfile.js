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
            //Note: minification doesn't work for ES6. Need a transpiler
            // task
            // style: {
			// 	files: {
            //         './static/build/style.min.js':
			// 			['./static/build/style.js']
			// 	}
			// },

            main: {
                files: {
                    './static/build/main.min.js':
						['./static/build/main.js']
				}
	        },
			// dataviewer: {
			// 	files: {
            //         './static/build/dataviewer.min.js':
			// 			['./static/build/dataviewer.js']
			// 	}
			// },
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
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-es6-transpiler');
    grunt.registerTask('default', ['requirejs', 'uglify'])

    //grunt.registerTask('default', ['requirejs', 'es6transpiler', 'uglify']);
    //grunt.registerTask('default', ['requirejs', 'transpile']);
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
