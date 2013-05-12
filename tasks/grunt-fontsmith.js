// Load in fontsmith and modules
var fontsmith = require('fontsmith'),
    fs = require('fs');

// TODO: Use observer pattern for stylesheets format inference as with grunt-spritesmith
// TODO: Formats should be css, styl, less, scss, sass, json
module.exports = function (grunt) {
  function gruntFontsmith() {

  }

  // Register grunt fontsmith as font task
  grunt.registerTask('font', 'Create fonts and CSS variables from SVGs', gruntFontsmith);
};