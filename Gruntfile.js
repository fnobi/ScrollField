module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        release: {
            options: {
                file: 'bower.json',
                npm: false
            }
        },
        mocha_html: {
            all: {
                src   : [
                    'bower_components/EventEmitter/EventEmitter.js',
                    'bower_components/inherits/inherits.js',
                    'ScrollField.js'
                ],
                test  : [ 'test/*-test.js' ],
                checkLeaks: false,
                assert : 'chai'
            }
        },
        koko: {
            test: {
                openPath: 'test/all.html'
            }
        }
    });

    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-mocha-html');
    grunt.loadNpmTasks('grunt-koko');
    grunt.registerTask('test', ['mocha_html', 'koko:test']);
    grunt.registerTask('default', ['mocha_html']);
};
