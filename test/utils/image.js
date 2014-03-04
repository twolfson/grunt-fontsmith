var fs = require('fs');
var exec = require('child_process').exec;
var imageDiff = require('image-diff');
var shellQuote = require('shell-quote').quote;
var tmp = require('tmp');
var cssUtils = require('./css');

exports.screenshotStylus = function (options) {
  // TODO: This screenshot is a little bit too magical by using `this.css` =(
  cssUtils.compileStylus(options);
  exports.screenshotCss(options);
};

exports.screenshotCss = function (options) {
  var cssPath;
  before(function saveCss (done) {
    // Save css to a temporary file
    var that = this;
    tmp.tmpName({postfix: '.css'}, function (err, filepath) {
      // If there was an error, callback
      if (err) {
        return done(err);
      }

      // Write out the file
      fs.writeFileSync(filepath, that.css, 'utf8');
      cssPath = filepath;

      // Complete the test run
      done();
    });
  });
  before(function screenshotCss (done) {
    var cmd = shellQuote(['phantomjs', 'scripts/screenshot_font.js', cssPath, options.screenshotPath]);
    exec(cmd, {cwd: __dirname}, function (err, stdout, stderr) {
      // Fallback error with stderr
      if (!err && stderr) {
        err = new Error(stderr);
      }

      // If there was stdout, log it
      if (stdout) {
        console.log('SCREENSHOT FONT STDOUT: ', stdout);
      }

      // Callback with our error and font
      done(err);
    });
  });
};

exports.diff = function (options) {
  before(function (done) {
    var that = this;
    imageDiff(options, function handleDiff (err, imagesAreSame) {
      that.imagesAreSame = imagesAreSame;
      done(err);
    });
  });
};
