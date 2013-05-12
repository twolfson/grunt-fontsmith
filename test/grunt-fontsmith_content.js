// Load in modules
var exec = require('child_process').exec;

// Clean up actual_files/
try { fs.unlinkSync('actual_files/'); } catch (e) {}

// Expose our test commands
module.exports = {
  'A set of SVGs': function () {
    this.task = 'default';
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
      if (!err) {
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

  },
  'generates fonts': function () {

  }
};