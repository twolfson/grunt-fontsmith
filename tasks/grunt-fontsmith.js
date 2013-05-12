// Load in fontsmith and modules
var fontsmith = require('fontsmith'),
    fs = require('fs');

// TODO: Use observer pattern for stylesheets format inference as with grunt-spritesmith
// TODO: Formats should be css, styl, less, scss, sass, json
module.exports = function (grunt) {
  var braceExpand = grunt.file.glob.minimatch.braceExpand;

  function gruntFontsmith() {
    // Localize info
    var data = this.data,
        src = data.src,
        destCss = data.destCss,
        destFontsRaw = data.destFonts;

    // Verify everything exists
    if (!src || !destCss || !destFontsRaw) {
      return grunt.fatal("grunt.font requires a src, destCss, and destFonts property");
    }

    // Grab files from src patterns
    var srcFiles = grunt.file.expand(src),
        destFonts = braceExpand(destFontsRaw);

    console.log(destFonts);

    // Prepare our parameters for fontsmith
    // console.log(srcFiles);

    // Begin our task being async
    var done = this.async();

    // TODO: Parse through fontsmith

      // TODO: Generate directories
      // TODO: Write out fonts via binary encoding
      // TODO: Generate CSS
      // TODO: Allow for other CSS engines
      // TODO: If there were any errors, display them
      // TODO: Callback
  }

  // Register grunt fontsmith as font task
  grunt.registerMultiTask('font', 'Create fonts and CSS variables from SVGs', gruntFontsmith);
};