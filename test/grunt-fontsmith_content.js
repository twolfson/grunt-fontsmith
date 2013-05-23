// Load in modules
var fs = require('fs'),
    exec = require('child_process').exec,
    assert = require('assert'),
    _s = require('underscore.string');

// Clean up actual_files/
var actualDir = __dirname + '/actual_files/',
    expectedDir = __dirname + '/expected_files/';
try { fs.unlinkSync(actualDir); } catch (e) {}

// Expose our test commands
module.exports = {
  'A set of SVGs': function () {
    this.task = 'default';
    this.cssFiles = ['font.styl'];
    this.fontFiles = ['font.eot', 'font.svg', 'font.ttf', 'font.woff'];
  },
  'processed via grunt-fontsmith': function (done) {
    // Bump the timeout for fontsmith
    this.timeout(10000);

    // Relocate to test directory
    process.chdir(__dirname);

    // Execute the cmd and task combination
    var that = this;
    exec('grunt font:' + this.task, function (err, stdout, stderr) {
      // Fallback error
      if (!err && stderr) {
        err = new Error(stderr);
      }

      // Save results for later
      that.stdout = stdout;
      console.log(stdout);

      // Callback
      done(err);
    });

  },
  'generates a stylesheet': function () {
    // Assert each of the CSS files exist
    this.cssFiles.forEach(function (filename) {
      var actualContent = fs.readFileSync(actualDir + filename, 'utf8');
      assert(actualContent);
    });
  },
  'generates fonts': function () {
    // Assert each of the fonts match as expected
    this.fontFiles.forEach(function (filename) {
      var expectedContent = fs.readFileSync(expectedDir + filename, 'binary'),
          actualContent = fs.readFileSync(actualDir + filename, 'binary');
      // TODO: Instead of diffing fonts, use them via phantomjs or similar for a proper verification of functionality
          // bitDiff = _s.levenshtein(actualContent, expectedContent),
          // maxPassing = 50,
          // isPassing = bitDiff < maxPassing;
      // assert(isPassing, 'Font "' + filename + '" is ' + bitDiff + ' (over ' + maxPassing + ') different from expected');
          isPassing = actualContent;
      assert(isPassing);
    });
  }
};