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
    var srcFiles = grunt.file.expand(src),
        destFontStrs = destFontsRaw,
        destFonts = destFontsRaw;

    // If the font format is a string, encapsulate it as an array
    if (typeof destFontsRaw === 'string') {
      destFontStrs = [destFontsRaw];
    }

    // If the font format is an array, collect them into an object
    if (Array.isArray(destFontStrs)) {
      destFonts = {};

      // Iterate over the fonts
      destFontStrs.forEach(function (destFontStr) {
        // Break down any brace exapansions
        var destFonts = braceExpand(destFontStr);

        // Iterate over the fonts
        destFonts.forEach(function (filepath) {
          // Grab the extension and save it under its key
          var ext = path.extname(filepath).slice(1);
          destFonts[ext] = filepath;
        });
      });
    }

    // Prepare our parameters for fontsmith
    var destFontFormats = Object.getOwnPropertyNames(destFonts),
        params = {
          'src': srcFiles,
          'fonts': destFontFormats
        },
        done = this.async();

    // DEV: Override fontsmith for faster iterations
    fontsmith = function (params, cb) {
      cb(null, {
        fonts: {
          svg: 'XML',
          ttf: '\u0000',
          woff: 'wOFFOTT',
          eot: ' \u0007',
          'dev-svg': 'DEV-XML'
        },
        map: { building_block: 57345, eye: 57344, moon: 57346 }
      });
    };

    // Parse through fontsmith
    fontsmith(params, function (err, result) {
      // If there was an error, callback with it
      // TODO: Is this the proper behavior for grunt? I forget =(
      if (err) {
        return done(err);
      }

      // Write out fonts via binary encoding
      var cssDir = path.dirname(destCss),
          fonts = result.fonts;
      destFontFormats.forEach(function (fontFormat) {
        // Localize the font destinations
        var filepath = destFonts[fontFormat],
            font = fonts[fontFormat];

        // Generate font directory
        var filedir = path.dirname(filepath);
        grunt.file.mkdir(filedir);

        // Write out the font
        fs.writeFileSync(filepath, font, 'binary');
      });

      // Generate CSS
      var map = result.map,
          names = Object.getOwnPropertyNames(map),
          chars = names.map(function (name) {
            return {
              name: name,
              value: map[name].toString(16),
              fonts: destFonts
            };
          });

      // TODO: Move this into json2fontcss
      var mustache = require('mustache'),
          tmpl = fs.readFileSync(__dirname + '/stylus.mustache.styl', 'utf8'),
          json2fontcss = function (params) {
            return mustache.render(tmpl, params);
          },
          css = json2fontcss({items: chars, fonts: destFonts});

      console.log(css);

      // TODO: We need to support also writing out CSS to JSON (visions of requiring JSON and using it in HTML)
      // TODO: Don't forget to create the directory (pretty sure we will be using grunt.file.write though)
      // Write out CSS

      // TODO: Allow for other CSS engines

      // TODO: If there were any errors, display them
      // Callback
      done();
    });
  }

  // Register grunt fontsmith as font task
  grunt.registerMultiTask('font', 'Create fonts and CSS variables from SVGs', gruntFontsmith);
};