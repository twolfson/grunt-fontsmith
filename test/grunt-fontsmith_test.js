var fs = require('fs');
var expect = require('chai').expect;
var cssUtils = require('./utils/css');
var fsUtils = require('./utils/fs');
var imageUtils = require('./utils/image');

function runGruntTask(task) {
  before(function (done) {
    // Bump the timeout for fontsmith
    this.timeout(60000);

    // Relocate to test directory
    process.chdir(__dirname);

    // Execute the cmd and task combination
    var that = this;
    exec('grunt ' + task, function (err, stdout, stderr) {
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
  });
}

describe('A set of SVGs', function () {
  describe('processed into a single font and stylesheet', function () {
    // TODO: Re-enable runGruntTask, it is disabled for faster dev
    // runGruntTask('font:single');

    fsUtils.loadActualLines(__dirname + '/actual_files/single/font.styl');
    fsUtils.loadExpectedLines(__dirname + '/expected_files/single/font.styl');
    it('produces a stylesheet', function () {
      // Determine how many lines are different
      var actualLines = this.actualLines;
      var differentLines = this.expectedLines.filter(function (line) {
        return actualLines.indexOf(line) === -1;
      });

      // Assert that only the character lines are different
      // TODO: If we ever have more than 3 sprites, update
      // the tests to be explicit about how many characters are being used
      expect(differentLines.length).to.be.at.most(3);
    });

    // Generate actual and expected screenshots
    imageUtils.screenshotStylus({
      cssFilepath: __dirname + '/actual_files/single/font.styl',
      fontFilepath: __dirname + '/actual_files/single/font.svg',
      fontFormat: 'svg',
      screenshotPath: __dirname + '/actual_files/single/actual.png'
    });
    imageUtils.screenshotStylus({
      cssFilepath: __dirname + '/expected_files/single/font.styl',
      fontFilepath: __dirname + '/expected_files/single/font.svg',
      fontFormat: 'svg',
      screenshotPath: __dirname + '/actual_files/single/expected.png'
    });
    imageUtils.diff({
      actualImage: __dirname + '/actual_files/single/actual.png',
      expectedImage: __dirname + '/actual_files/single/expected.png',
      diffImage: __dirname + '/actual_files/single/diff.png'
    });
    it('produces a font', function () {
      expect(this.imagesAreSame).to.equal(true);
    });
  });

  describe('processed into multiple fonts and stylesheets', function () {
    it.skip('produces multiple stylesheets', function () {

    });
    it.skip('produces multiple fonts', function () {

    });
  });

  describe('processed into overridden fonts and stylesheets', function () {
    it.skip('produces stylesheets with proper formats', function () {

    });
    it.skip('produces fonts with proper formats', function () {

    });
  });
});
