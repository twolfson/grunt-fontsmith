var fs = require('fs');
var exec = require('child_process').exec;
var tmp = require('tmp');
var shellQuote = require('shell-quote').quote;

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
    var cmd = shellQuote(['phantomjs', 'test_scripts/screenshot_font.js', cssPath, options.screenshotPath]);
    exec(cmd, {cwd: __dirname + '/../'}, function (err, stdout, stderr) {
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
