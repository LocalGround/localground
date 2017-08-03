module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
	    requirejs: {
	        spreadsheet: {
                options: {
                    out: './static/redesign/build/spreadsheet.js',
                    baseUrl: "./static/redesign/",
                    mainConfigFile: "./static/redesign/apps/require-config.js",
                    name: 'apps/spreadsheet/spreadsheet-app',
                    removeCombined: 'true',
                    findNestedDependencies: 'true',
                    wrapShim: 'true',
                    optimize: 'none'
                }
	        }
		},

		uglify: {
			spreadsheet: {
				files: {
                    './static/redesign/build/spreadsheet.min.js':
						['./static/redesign/build/spreadsheet.js']
				}
			}
		}

    });
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['requirejs', 'uglify']);
};


/*
 *
 * 1814  grunt
 1815  history
 1816  grunt
 1817  locate grunt
 1818  npm install grunt grunt-cli grunt-contrib-requirejs 
 1819  sudo npm install grunt grunt-cli grunt-contrib-requirejs 
 1820  cd ../../../
 1821  ll
 1822  cd ../
 1823  ll
 1824  touch Gruntfile.js
 1825  vi Gruntfile.js 
 1826  grunt requirejs:spreadsheet
 1827  grunt
 1828  sudo apt-get --purge remove node
 1829  grunt
 1830  sudo apt-get install nodejs
 1831  locate node
 1832  locate -b '\node'
 1833  sudo ln -s /usr/bin/nodejs /usr/bin/node
 1834  node
 1835  sudo ln -s /usr/bin/nodejs /usr/sbin/node
 1836  node
 1837  grunt
 1838  npm install -g grunt-cli
 1839  sudo npm install -g grunt-cli
 1840  grunt
 1841  npm init
 1842  grunt
 1843  npm install grunt --save-dev
 1844  grunt
 1845  history | grep npm
 1846  npm install grunt-contrib-requirejs
 1847  npm install grunt-contrib-uglify
 1848  sudo npm install grunt-contrib-uglify
 1849  grunt*/
