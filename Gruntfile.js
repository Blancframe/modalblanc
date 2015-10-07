module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
          dev: {
            src: ['index.js'],
            dest: 'public/compiled.js',
            options: {
                watch: true,
                keepAlive: true
            }
          }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('dev', function(target) {

        grunt.task.run([
            'browserify'    
        ])
    });
};