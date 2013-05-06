module.exports = function (grunt) {
  grunt.initConfig({
    lint: {
      all: ["grunt.js", "tasks/*.js", "test/*.js"]
    }
  });
  grunt.registerTask("default", "lint");
};