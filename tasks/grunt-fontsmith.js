// Load in fontsmith and modules
var fs = require('fs'),
    path = require('path'),
    fontsmith = require('fontsmith'),
    json2fontcss = require('json2fontcss'),
    url = require('url2');

// TODO: Use observer pattern for stylesheets format inference
// (i.e. .addCssFormat, .addFontFormat)
// TODO: Formats should be css, styl, less, scss, sass, json
// and svg, dev-svg, woff, eot, ttf
// TODO: This should be for extension adjustment. If not found, fallback to extension itself.
module.exports = function (grunt) {
  var braceExpand = grunt.file.glob.minimatch.braceExpand;

  function gruntFontsmith() {
    // Localize info
    var data = this.data,
        src = data.src,
        destCss = data.destCss,
        destFontsRaw = data.destFonts,
        that = this;

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
        var destFontPaths = braceExpand(destFontStr);

        // Iterate over the fonts
        destFontPaths.forEach(function (filepath) {
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

    // // DEV: Override fontsmith for faster iterations
    // fontsmith = function (params, cb) {
    //   var resJson = fs.readFileSync('tmp.json', 'binary');
    //   cb(null, JSON.parse(resJson));
    // };

    // Parse through fontsmith
    fontsmith(params, function (err, result) {
      // DEV: Write out JSON response to file
      // fs.writeFileSync('tmp.json', JSON.stringify(result), 'binary');

      // If there was an error, callback with it
      if (err) {
        grunt.fatal(err);
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

      // Generate relative font paths
      var relFonts = {},
          router = data.router || url.relative.bind(url, destCss);
      destFontFormats.forEach(function (fontFormat) {
        var filepath = destFonts[fontFormat],
            relpath = router(filepath);
        relFonts[fontFormat] = relpath;
      });

      // Generate CSS
      var map = result.map,
          names = Object.getOwnPropertyNames(map),
          target = that.target,
          fontFamily = data.fontFamily || 'fontsmith-' + target,
          chars = names.map(function (name) {
            return {
              name: name,
              value: map[name].toString(16)
            };
          });

      // TODO: We need to support also writing out CSS to JSON (visions of requiring JSON and using it in HTML)
      // TODO: This means writing out multiple CSS destinations (and interpretting CSS multiple times)
      var css = json2fontcss({
            chars: chars,
            fonts: destFonts,
            fontFamily: fontFamily,
            template: 'less',
            options: data.cssOptions || {}
          });

      // Write out CSS
      grunt.file.write(destCss, css, 'utf8');

      // If there were any errors, display them
      if (that.errorCount) {
        return done(false);
      }

      // Notify the user of the created files
      // TODO: Handle multiple CSS engines
      var destFontPaths = destFontFormats.map(function (fontFormat) {
            return destFonts[fontFormat];
          }),
          destPaths = destFontPaths.concat([destCss]);
      grunt.log.writeln('Files "' + destPaths.join('", "') + '" created.');

      // Callback
      done();
    });
  }

  // Register grunt fontsmith as font task
  grunt.registerMultiTask('font', 'Create fonts and CSS variables from SVGs', gruntFontsmith);
};