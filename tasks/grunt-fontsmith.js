// Load in fontsmith and modules
var fontsmith = require('fontsmith'),
    fs = require('fs'),
    path = require('path'),
    url = require('url2');

// TODO: Use observer pattern for stylesheets format inference as with grunt-spritesmith
// TODO: Formats should be css, styl, less, scss, sass, json
module.exports = function (grunt) {
  var braceExpand = grunt.file.glob.minimatch.braceExpand;

  function gruntFontsmith() {
    console.log(this);
    // Localize info
    var target = this.target,
        data = this.data,
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

    // DEV: Override fontsmith for faster iterations
    fontsmith = function (params, cb) {
      var resJson = fs.readFileSync('tmp.json', 'binary');
      cb(null, JSON.parse(resJson));
    };

    // Parse through fontsmith
    fontsmith(params, function (err, result) {
      // DEV: Write out JSON response to file
      // fs.writeFileSync('tmp.json', JSON.stringify(result), 'binary');

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
          fontFamily = data.fontFamily || 'fontsmith-' + target,
          chars = names.map(function (name) {
            return {
              name: name,
              value: map[name].toString(16),
              fonts: relFonts
            };
          });

      // TODO: Move this into json2fontcss
      // TODO: Allow for other CSS engines
      var mustache = require('mustache'),
          // tmpl = fs.readFileSync(__dirname + '/stylus.mustache.styl', 'utf8'),
          tmpl = fs.readFileSync(__dirname + '/less.mustache.less', 'utf8'),
          json2fontcss = function (params) {
            return mustache.render(tmpl, params);
          },
          css = json2fontcss({
            items: chars,
            fonts: destFonts,
            fontFamily: JSON.stringify(fontFamily),
            format: 'less',
            options: data.cssOptions || {}
          });

      console.log(css);

      // TODO: We need to support also writing out CSS to JSON (visions of requiring JSON and using it in HTML)
      // TODO: This means writing out multiple CSS destinations (and interpretting CSS multiple times)
      // Write out CSS
      grunt.file.write(destCss, css, 'utf8');

      // TODO: If there were any errors, display them
      // TODO: Notify the user of the created files
      // Callback
      done();
    });
  }

  // Register grunt fontsmith as font task
  grunt.registerMultiTask('font', 'Create fonts and CSS variables from SVGs', gruntFontsmith);
};