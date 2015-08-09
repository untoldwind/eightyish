module.exports = (grunt) ->
  grunt.initConfig
    coffee:
      app:
        expand: true
        cwd: 'src'
        src: ['**/*.coffee']
    watch:
      app:
        files: '**/*.coffee'
        tasks: ['coffee']
    bower:
      install: {
      }

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-bower-task'

  grunt.registerTask 'default', ['coffee']