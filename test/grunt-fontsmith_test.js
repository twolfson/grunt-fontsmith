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
    runGruntTask('font:single');
    // this.cssFiles = ['single/font.styl'];
    // this.fontFiles = [{
    //   path: 'single/font.svg',
    //   format: 'svg'
    // }];
    // TODO: Expand into namespace or object
      // // Assert each of the CSS files exist
      // this.cssFiles.forEach(function (filename) {
      //   // Grab the expected and actual content
      //   var expectedContent = fs.readFileSync(expectedDir + filename, 'utf8'),
      //       actualContent = fs.readFileSync(actualDir + filename, 'utf8');

      //   // Break down the content into separate lines
      //   var expectedLines = expectedContent.split('\n'),
      //       actualLines = actualContent.split('\n');
    fsUtils.loadActualLines('single/font.styl');
    fsUtils.loadExpectedLines('single/font.styl');
    fsUtils.screenshotActualFont({
      path: 'single/font.svg',
      format: 'svg'
    });
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


    it.skip('produces a stylesheet', function () {
      // Determine how many lines are different
      var differentLines = expectedLines.filter(function (line) {
            return actualLines.indexOf(line) === -1;
          });

      // Assert that only the character lines are different
      // TODO: If we ever have more than 3 sprites, update
      // the tests to be explicit about how many characters are being used
      assert(differentLines.length <= 3);
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
