// Load in fontsmith and modules
var fontsmith = require('fontsmith'),
    fs = require('fs'),
    path = require('path');

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

    // Normalize and collect info from file patterns
    // TODO: Handle arrays of font patterns
    // TOOD: Handle object mappings for fonts
    // TODO: Technically, the object format is the de-facto format
    var srcFiles = grunt.file.expand(src),
        destFonts = braceExpand(destFontsRaw),
        destFontFormats = destFonts.map(function (filepath) {
          return path.extname(filepath).slice(1);
        });

    // Prepare our parameters for fontsmith
    var params = {
          'src': srcFiles,
          'fonts': destFontFormats
        },
        done = this.async();

    //  Parse through fontsmith
    // fontsmith(params, function (err, result) {
    var err = null,
        result = { fonts:
           { svg: 'XML',
             ttf: '\u0000',
             woff: 'wOFFOTT',
             eot: ' \u0007',
             'dev-svg': 'DEV-XML' },
          map: { building_block: 57345, eye: 57344, moon: 57346 } };
      // If there was an error, callback with it
      // TODO: Is this the proper behavior for grunt? I forget =(
      if (err) {
        return done(err);
      }

      // Generate directories
      console.log(result);

      // TODO: Write out fonts via binary encoding
      // TODO: Generate CSS
      // TODO: Allow for other CSS engines
      // TODO: If there were any errors, display them
      // Callback
      done();
    // });
  }

  // Register grunt fontsmith as font task
  grunt.registerMultiTask('font', 'Create fonts and CSS variables from SVGs', gruntFontsmith);
};