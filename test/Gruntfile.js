module.exports = function (grunt) {
  // Load in legacy config
  require('./grunt')(grunt);

  // Override default task
  grunt.registerTask('default', ['font']);
};