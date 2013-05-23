module.exports = function (grunt) {
  grunt.initConfig({
    font: {
      'default': {
        src: ['test_files/*.svg'],
        // TODO: Allow JSON output as well
        destCss: 'actual_files/font.css',
        destFonts: 'actual_files/font.{svg,woff,eot,ttf}'
        // // Alternative formats (1)
        // destFonts: [
        //   'actual_files/font.svg',
        //   'actual_files/font.woff',
        //   'actual_files/font.eot'
        // ]
        // // Alternative formats (2)
        // destFonts: {
        //   // Override specific engines
        //   'dev-svg': 'actual_files/font.svg',
        //   'woff': 'actual_files/font.waffles',
        //   'eot': 'actual_files/more.like.eof'
        // }

        // TODO: Custom routing of font filepaths for CSS intricacies
        // cssPathRouter: function (fontpath) {
        //   return fontpath;
        // }

        // TODO: Allow custom naming of font families for multi support
        // TODO: It would be smart to name it after the task ;)
        // TODO: Don't forget to escape this (JSON.stringify)
        // fontname: 'my-icon-font'
      }
    }
  });

  // Load in grunt-fontsmith
  grunt.loadTasks('../tasks');
};