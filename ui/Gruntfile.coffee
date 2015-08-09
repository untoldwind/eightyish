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

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', ['coffee']