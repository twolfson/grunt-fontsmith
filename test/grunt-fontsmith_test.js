var fs = require('fs');
var expect = require('chai').expect;
var stylus = require('stylus');
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

    // imageUtils.screenshotActualFont({
    //   path: 'single/font.svg',
    //   format: 'svg'
    // });
    before(function generateStylus (done) {
      // Define and load Stylus to work with
      var expectedCssObj = {
        eot: fs.readFileSync(__dirname + '/test_files/font.eot.css', 'utf8'),
        svg: fs.readFileSync(__dirname + '/test_files/font.svg.css', 'utf8'),
        ttf: fs.readFileSync(__dirname + '/test_files/font.ttf.css', 'utf8'),
        woff: fs.readFileSync(__dirname + '/test_files/font.woff.css', 'utf8')
      };
      var charStyl = [
        '.icon-eye',
        '  icon($eye)',
        '.icon-building_block',
        '  icon($building_block)',
        '.icon-moon',
        '  icon($moon)'
      ].join('\n');
      var actualStyl = fs.readFileSync(__dirname + '/actual_files/single/font.styl', 'utf8');

      // Remove unused font formats
      // TODO: Use `screenshotActualFont.format`
      var fontFormat = 'svg';
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

      // Replace font path with our font path
      // TODO: Replace with `screenshotActualFont.path`
      var actualDir = __dirname + '/actual_files';
      var filepath = 'single/font.svg';
      var fontname = 'font.' + fontFormat;
      var expectedCss = expectedCssObj[fontFormat];
      actualStyl = actualStyl.replace(fontname,  actualDir + filepath);

      // Assert our replacements were successful
      expect(actualStyl).to.contain(actualDir, 'Actual stylus has not replaced "' + fontname + '" with "' + actualDir + filepath + '" successfully');
      // TODO: Perform in separate screenshot action
      // var expectedDir = __dirname + '/expected_files';
      // expectedCss = expectedCss.replace(fontname, expectedDir + filepath);
      // expect(expectedCss).to.contain(expectedDir, 'Expected css has not replaced "' + fontname + '" with "' + expectedDir + filepath + '" successfully');

      // Render Stylus
      stylus.render(actualStyl + '\n' + charStyl, function (err, css) {
        // Save the CSS for later and callback
        this.actualCss = css;
        done(err);
      });
    });
// TODO: Screenshot actualCss and compare with iamge-diff
      // terfall([
      //       stylus.render.bind(this, actualStyl + '\n' + charStyl),
      //       saveToFile,
      //       screenshotFont.bind(this, {context: 'actual'})
      //     ], cb);
      //       // Screenshot the font in use
      // console.log(cssPath);

      // exec('phantomjs test_scripts/screenshot_font.js ' + cssPath, function (err, stdout, stderr) {
      //   // Fallback error with stderr
      //   if (!err && stderr) {
      //     err = new Error(stderr);
      //   }

      //   // If there was stdout, log it
      //   if (stdout) {
      //     console.log('SCREENSHOT FONT STDOUT: ', stdout);
      //   }

      //   // Always create screenshots for debugging
      //   fs.writeFileSync('tmp.' + options.context + '.' + fontFormat + '.png', stdout, 'base64');

      //   // Callback with our error and font
      //   cb(err, stdout);
      // });


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
    it.skip('produces a font', function () {
      assert.strictEqual(fonts[0], fonts[1]);
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
