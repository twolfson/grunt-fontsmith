module.exports = function (grunt) {
  grunt.initConfig({
    font: {
      single: {
        src: ['test_files/*.svg'],
        destCss: 'actual_files/single/font.styl',
        destFonts: 'actual_files/single/font.svg'
      },
      multiple: {
        src: ['test_files/*.svg'],
        destCss: 'actual_files/multiple/font.{styl,json}',
        destFonts: 'actual_files/multiple/font.{svg,ttf,eot,woff}'
      },
      overrides: {
        src: ['test_files/*.svg'],
        destCss: {
          // Override specific engines
          json: 'actual_files/overrides/jason.less',
          styl: 'actual_files/overrides/styleee.json'
        },
        destFonts: {
          // Override specific engines
          woff: 'actual_files/overrides/waffles.ttf',
          svg: 'actual_files/overrides/essveegee.eot'
        }
      }
      // 'every-option': {
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
        // destCss: {
        //   // Override specific engines
        //   json: 'actual_files/font.less',
        //   styl: 'actual_files/font.json'
        // }
        // destFonts: {
        //   // Override specific engines
        //   'dev-svg': 'actual_files/font.svg',
        //   woff: 'actual_files/font.waffles',
        //   eot: 'actual_files/more.like.eof'
        // }

        // // Optional: Custom routing of font filepaths for CSS
        // cssRouter: function (fontpath) {
        //   return fontpath;
        // }

        // // Alternative format for format-specific routing
        // cssRouter: {
        //     json: function (fontpath) {
        //       return fontpath;
        //     },
        //     styl: function (fontpath) {

        //     }
        // }

        // // Optional: Custom naming of font families for multi-task support
        // fontFamily: 'my-icon-font'

        // // Optional: CSS options for json2fontcss
        // // Unfortunately, this must be delimited by extension format
        // // It is impractical to share a common options set across formatters
        // // as well as introspect an object for reserved keys since it limits semantic options (e.g. SCSS option for SASS)
        // cssOptions: {
        //   json: {},
        //   styl: {}
        // }
      // }
    }
  });

  // Load in grunt-fontsmith
  grunt.loadTasks('../tasks');
};
