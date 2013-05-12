var exec = require('child_process').exec;

module.exports = {
  'A set of SVGs': function () {
    this.task = 'default';
  },
  'processed via grunt-fontsmith': function (done) {
    // Relocate to test directory
    process.chdir(__dirname);

    // Execute the cmd and task combination
    var that = this;
    exec('grunt ' + this.task, function (err, stdout, stderr) {
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