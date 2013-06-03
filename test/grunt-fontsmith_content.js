// Load in modules
var fs = require('fs'),
    exec = require('child_process').exec,
    assert = require('assert'),
    _s = require('underscore.string');

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

// Expose our test commands
module.exports = {
  'A set of SVGs': function () {},
  'processed into a single font and stylesheet': [function () {
    this.task = 'single';
    this.cssFiles = ['single/font.styl'];
    this.fontFiles = ['single/font.svg'];
  }, 'processed via grunt-fontsmith'],
  'processed into multiple fonts and stylesheets': [function () {
    this.task = 'multiple';
    this.cssFiles = ['multiple/font.styl', 'multiple/font.json'];
    this.fontFiles = ['multiple/font.svg', 'multiple/font.ttf', 'multiple/font.eot', 'multiple/font.woff'];
  }, 'processed via grunt-fontsmith'],
  'processed into overridden fonts and stylesheets': [function () {
    this.task = 'overrides';
    this.cssFiles = ['overrides/jason.less', 'overrides/styleee.json'];
    this.fontFiles = ['overrides/waffles.ttf', 'overrides/eof.svg'];
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
  'produces a font': 'produces fonts',
  'produces multiple fonts': 'produces fonts',
  'produces fonts with proper formats': 'produces fonts',
  'produces fonts': function (done) {
    // Assert each of the fonts match as expected
    // TODO: Deal with being offline and needing async
    async.forEach(this.fontFiles, function testFont (filename, cb) {
      exec('phantomjs test_scripts/diff_fonts.js ' + filename, function (err, stdout, stderr) {
        // Fallback error with stderr
        if (!err && stderr) {
          err = new Error(stderr);
        }

        // Callback with our error
        done(err);
      });
    }, cb);
  }
};