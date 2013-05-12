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

      // Generate directories
      var cssDir = path.dirname(destCss),
          fontDirs = destFonts.map(path.dirname),
          dirs = [cssDir].concat(fontDirs);
      dirs.forEach(grunt.file.mkdir);

      // Write out fonts via binary encoding
      var fonts = result.fonts;
      destFonts.forEach(function (filepath) {
        // TODO: Instead of DRYing with a function, move to the damn de-facto format
        var fontFormat = path.extname(filepath).slice(1),
            font = fonts[fontFormat];
        fs.writeFileSync(filepath, font, 'binary');
      });

      // Generate CSS
      var map = result.map,
          names = Object.getOwnPropertyNames(map),
          chars = names.map(function (name) {
            return {name: name, value: map[name].toString(16)};
          });

      // TODO: Move this into json2fontcss
      var mustache = require('mustache'),
          tmpl = fs.readFileSync(__dirname + '/css.mustache.css', 'utf8'),
          json2fontcss = function (params) {
            return mustache.render(tmpl, params);
          },
          css = json2fontcss({items: chars});

      console.log(css);

      // TODO: We need to support also writing out CSS to JSON (visions of requiring JSON and using it in HTML)
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