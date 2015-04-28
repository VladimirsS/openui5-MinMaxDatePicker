/*eslint-env node*/
'use strict';
module.exports = function(grunt) {

    // Load Grunt tasks declared in the package.json file
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        dir: {
            webapp: '.'
        },

        // grunt-contrib-connect will serve the files of the project on specified port and hostname
        connect: {
            options: {
                port: 9080,
                hostname: '*',
                base: "."
            },
            src: {},
            dist: {}
        },

        // Provides middleware for the grunt-contrib-connect task to run a web server.
        openui5_connect: {
            src: {
                options: {
                    appresources: ['<%= dir.webapp %>']
                }
            }
        },

        // ESLint plugins used by OpenUI5
        eslint: {
            options: {
                quiet: true
            },
            webapp: ['<%= dir.webapp %>/src']
        }
    });

    // Linting task
    grunt.registerTask('lint', ['eslint:webapp']);

    // Server task
    grunt.registerTask('serve', function(target) {
        grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
    });

    // Run builded app
    grunt.registerTask('default', 'lint');
};
