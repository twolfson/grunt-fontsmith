// Load in modules
var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec,
    assert = require('assert'),
    async = require('async'),
    stylus = require('stylus');

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

// TODO: Render expected CSS ... or just steal from actual once we generate it =P

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
    this.timeout(10000);

    // Relocate to test directory
    process.chdir(__dirname);

    // Execute the cmd and task combination
    var that = this;
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
      // console.log(stdout);

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
  'produces a font': [function (done) {
    var styl = fs.readFileSync(actualDir + '/multiple/font.styl', 'utf8');
    console.log('hey');
    stylus.render(styl + '\n' + charStyl, function (err, css) {
      // TODO: Save this and embrace doubleshot modularity
      console.log(css);
      console.log('yyz');
      // TODO: Generate tmpfile
      // TODO: Write CSS to tmpfile
      done(err);
    });
  }, 'produces fonts'],
  'produces multiple fonts': 'produces fonts',
  'produces fonts with proper formats': 'produces fonts',
  'produces fonts': function (done) {
    // TODO: Latest gameplan
    // In each of the one-off prep cases, generate the Stylus/JSON/whatever to CSS
    // Save the CSS to a temporary file
    // Do the same pre-emptively for the expected fonts
    // Tell phantomjs where to load the font from
    // Screenshot the sets of CSS

    // TODO: The font-family definition will likely be wrong (too much excess)
    // so we might need to take on a hybrid approach here
    // either replace the font-family block
    // or replace it programatically in the CSS language (e.g. in Stylus)

    // Assert each of the fonts match as expected
    // TODO: Deal with being offline and needing async
    async.forEach(this.fontFiles, function testFont (font, cb) {
      // In parallel, screenshot actual font vs expected font
      var actualPath = path.join(actualDir, font.path),
          expectedPath = path.join(expectedDir, font.path);
      async.map([actualPath, expectedPath], function screenshotFont (filepath, cb) {
        exec('phantomjs test_scripts/screenshot_font.js ' + filepath + ' ' + font.format, function (err, stdout, stderr) {
          // Fallback error with stderr
          if (!err && stderr) {
            err = new Error(stderr);
          }

          // If there was stdout, log it
          if (stdout) {
            console.log('SCREENSHOT FONT STDOUT: ', stdout);
          }

          // Callback with our error
          cb(err);
        });
      }, function compareScreenshots (err, screenshots) {
        // If there was an error, callback with it
        if (err) { return cb(err); }

        // Compare the generated screenshots
        // TODO: Might need to use imagemagick to compare images?
      });
    }, done);
  }
};