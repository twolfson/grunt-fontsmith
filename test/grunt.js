module.exports = function (grunt) {
  grunt.initConfig({
    font: {
      'default': {
        src: ['test_files/*.svg'],
        destCss: 'actual_files/font.styl',
        destFonts: 'actual_files/font.{svg,woff,eot,ttf}'
        // // Multiple CSS output support
        // destCss: 'actual_files/font.{styl,json}',

        // // Alternative formats (1)
        // destCss:[
        //   'actual_files/font.styl',
        //   'actual_files/font.json'
        // ]
        // destFonts: [
        //   'actual_files/font.svg',
        //   'actual_files/font.woff',
        //   'actual_files/font.eot'
        // ]

        // // Alternative formats (2)
        // destFonts: {
        //   // Override specific engines
        //   'json': 'actual_files/font.less',
        //   'styl': 'actual_files/font.json'
        // }
        // destFonts: {
        //   // Override specific engines
        //   'dev-svg': 'actual_files/font.svg',
        //   'woff': 'actual_files/font.waffles',
        //   'eot': 'actual_files/more.like.eof'
        // }

        // // Optional: Custom routing of font filepaths for CSS intricacies
        // cssRouter: function (fontpath) {
        //   return fontpath;
        // }

        // // Optional: Custom naming of font families for multi-task support
        // fontFamily: 'my-icon-font'

        // // Optional: CSS options for json2fontcss
        // cssOptions: {}
      }
    }
  });

  // Load in grunt-fontsmith
  grunt.loadTasks('../tasks');
};