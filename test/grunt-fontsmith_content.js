// Load in modules
var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec,
    assert = require('assert'),
    async = require('async'),
    stylus = require('stylus'),
    TempFile = require('temporary/lib/file');

// Clean up actual_files/
var actualDir = __dirname + '/actual_files/',
    expectedDir = __dirname + '/expected_files/';
try { fs.unlinkSync(actualDir); } catch (e) {}

// DEV: Warn myself if we are loading from offline
var gruntFontsmithSrc = fs.readFileSync(__dirname + '/../tasks/grunt-fontsmith.js', 'utf8');
if (!gruntFontsmithSrc.match(/\s+\/\/[^\n]*=[^\n]*tmp.json/)) {
  console.error('WARNING!!!');
  console.error('YOU ARE WORKING ON AN OFFLINE VERSION!!!');
}

// Load in common expected CSS
var expectedCssObj = {
      eot: fs.readFileSync(__dirname + '/test_files/font.eot.css', 'utf8'),
      svg: fs.readFileSync(__dirname + '/test_files/font.svg.css', 'utf8'),
      ttf: fs.readFileSync(__dirname + '/test_files/font.ttf.css', 'utf8'),
      woff: fs.readFileSync(__dirname + '/test_files/font.woff.css', 'utf8')
    };

// Prepare common stylus for font testing
var charStyl = [
  '.icon-eye',
  '  icon($eye)',
  '.icon-building_block',
  '  icon($building_block)',
  '.icon-moon',
  '  icon($moon)'
].join('\n');

// Expose our test commands
module.exports = {
  // Fixture setups
  'A set of SVGs': function () {},
  'processed into a single font and stylesheet': [function () {
    this.task = 'single';
    this.cssFiles = ['single/font.styl'];
    this.fontFiles = [{
      path: 'single/font.svg',
      format: 'svg'
    }];
  }, 'processed via grunt-fontsmith'],

  'processed into multiple fonts and stylesheets': [function () {
    this.task = 'multiple';
    this.cssFiles = ['multiple/font.styl', 'multiple/font.json'];
    this.fontFiles = [{
      path: 'multiple/font.svg',
      format: 'svg'
    }, {
      path: 'multiple/font.ttf',
      format: 'ttf'
    }, {
      path: 'multiple/font.eot',
      format: 'eot'
    }, {
      path: 'multiple/font.woff',
      format: 'woff'
    }];
  }, 'processed via grunt-fontsmith'],

  'processed into overridden fonts and stylesheets': [function () {
    this.task = 'overrides';
    this.cssFiles = ['overrides/jason.less', 'overrides/styleee.json'];
    this.fontFiles = [{
      path: 'overrides/waffles.ttf',
      format: 'woff'
    }, {
      path: 'overrides/eof.svg',
      format: 'eot'
    }];
  }, 'processed via grunt-fontsmith'],

  'processed via grunt-fontsmith': function (done) {
    // Bump the timeout for fontsmith
    this.timeout(60000);

    // Relocate to test directory
    process.chdir(__dirname);

    // Execute the cmd and task combination
    var that = this;
    console.log('wat');
    exec('grunt font:' + this.task, function (err, stdout, stderr) {
      // If there was an error, show me the output
      if (err) {
        console.log(stdout, stderr);
      }

      // Fallback error
      if (stderr) {
        err = new Error(stderr);
      }

      // Save results for later
      that.stdout = stdout;
      console.log('hai');

      // Callback
      done(err);
    });

  },

  // CSS assertions
  'produces a stylesheet': 'produces stylesheets',
  'produces multiple stylesheets': 'produces stylesheets',
  'produces stylesheets with proper formats': 'produces stylesheets',
  'produces stylesheets': function () {
    // Assert each of the CSS files exist
    this.cssFiles.forEach(function (filename) {
      // Grab the expected and actual content
      var expectedContent = fs.readFileSync(expectedDir + filename, 'utf8'),
          actualContent = fs.readFileSync(actualDir + filename, 'utf8');

      // Break down the content into separate lines
      var expectedLines = expectedContent.split('\n'),
          actualLines = actualContent.split('\n');

      // Determine how many lines are different
      var differentLines = expectedLines.filter(function (line) {
            return actualLines.indexOf(line) === -1;
          });

      // Assert that only the character lines are different
      // TODO: If we ever have more than 3 sprites, update
      // the tests to be explicit about how many characters are being used
      assert(differentLines.length <= 3);
    });
  },

  // Font assertions
  'produces a font': 'produces fonts',
  'produces multiple fonts': 'produces fonts',
  'produces fonts with proper formats': 'produces fonts',
  'produces fonts': function (done) {
    // DEV: This is an ugly monstrosity which renders and compares every generated font
    // Load in Stylus
    var styl = fs.readFileSync(expectedDir + '/multiple/font.styl', 'utf8');

    // Iterate over the fontFiles
    var fontFiles = this.fontFiles;
    async.forEach(fontFiles, function compareFontFile (fontFile, cb) {
      // Remove unused font formats
      var fontFormat = fontFile.format,
          actualStyl = styl;
      if (fontFormat !== 'eot') {
        actualStyl = actualStyl.replace(/\s+src:url\("font.eot"\);/, '');
        actualStyl = actualStyl.replace(/\s*url\("font.eot\?#iefix"\) format\("embedded-opentype"\),\s*/, '');
      }
      if (fontFormat !== 'woff') {
        actualStyl = actualStyl.replace(/\s*url\("font.woff"\) format\("woff"\),\s*/, '');
      }
      if (fontFormat !== 'ttf') {
        actualStyl = actualStyl.replace(/\s*url\("font.ttf"\) format\("truetype"\),\s*/, '');
      }
      if (fontFormat !== 'svg') {
        // Guarantee no-commas for font formats
        actualStyl = actualStyl.replace(',', ';');
        actualStyl = actualStyl.replace(/\s*url\("font.svg#icomoon"\) format\("svg"\);\s*/, '');
      }

      // If the fontFormat is `eot`, skip this assertion as it can only be done by IE
      if (fontFormat === 'eot') {
        return cb();
      }

      // Replace font path with our font path
      var filepath = fontFile.path,
          fontname = 'font.' + fontFormat,
          expectedCss = expectedCssObj[fontFormat];
      actualStyl = actualStyl.replace(fontname, actualDir + filepath),
      expectedCss = expectedCss.replace(fontname, expectedDir + filepath);

      // Assert our replacements were successful
      assert.notEqual(actualStyl.indexOf(actualDir), -1, 'Actual stylus has not replaced "' + fontname + '" with "' + actualDir + filepath + '" successfully');
      assert.notEqual(expectedCss.indexOf(expectedDir), -1, 'Expected css has not replaced "' + fontname + '" with "' + expectedDir + filepath + '" successfully');

      function saveToFile(content, cb) {
        // DEV: PhantomJS may require a .css extension for proper mime-types and whatnot
        // Save css to a temporary file
        var tmpFile = new TempFile();
        tmpFile.writeFileSync(content, 'utf8');

        // Save a reference to the file path
        cb(null, tmpFile.path);
      }

      function screenshotFont(options, cssPath, cb) {
        // Screenshot the font in use
        console.log(cssPath);
        exec('phantomjs test_scripts/screenshot_font.js ' + cssPath, function (err, stdout, stderr) {
          // Fallback error with stderr
          if (!err && stderr) {
            err = new Error(stderr);
          }

          // If there was stdout, log it
          if (stdout) {
            console.log('SCREENSHOT FONT STDOUT: ', stdout);
          }

          // Always create screenshots for debugging
          fs.writeFileSync('tmp.' + options.context + '.' + fontFormat + '.png', stdout, 'base64');

          // Callback with our error and font
          cb(err, stdout);
        });
      }

      // In parallel, screenshot the expected and actual font
      async.parallel([
        function renderActualFont (cb) {
          async.waterfall([
            stylus.render.bind(this, actualStyl + '\n' + charStyl),
            saveToFile,
            screenshotFont.bind(this, {context: 'actual'})
          ], cb);
        },
        function renderExpectedFont (cb) {
          async.waterfall([
            saveToFile.bind(this, expectedCss),
            screenshotFont.bind(this, {context: 'expected'})
          ], cb);
        }
      ], function compareFonts (err, fonts) {
        // If there is an error, callback with it
        if (err) { return cb(err); }

        // Otherwise, assert the fonts are equal and callback
        assert.strictEqual(fonts[0], fonts[1]);
        cb();
      });
    }, done);

  }
};
