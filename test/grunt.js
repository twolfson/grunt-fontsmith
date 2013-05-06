module.exports = function (grunt) {
  grunt.initConfig({
    font: {
      'default': {
        src: ['test_files/*.svg'],

        // TODO: Contemplating sugar at fundamental stages
        // // Writes out files to font.svg, font.woff, font.ttf, font.css
        // dest: 'actual_files/font'

        // DEV: These are sloppy since we cannot quickly/easily pick up which fonts are being opted in to
        // destCss: 'actual_files/font.css',
        // destEot: 'actual_files/font.eot',
        // destSvg: 'actual_files/font.svg',
        // destTtf: 'actual_files/font.ttf',
        // destWoff: 'actual_files/font.woff'

        // // DEV: This might work
        // destCss: 'actual_files/font.css',
        // destFonts: {
        //   'svg': 'actual_files/font.svg'
        // }

        // // DEV: This is still not the best since we don't have an automagic fall out for CSS format
        // // This is probably best
        // dest: 'actual_files/font', // expands to font.css, font.svg, font.ttf
        // // Assumes all if not specified
        // fonts: 'svg eot ttf',
        // // Custom routing of files
        // router: function (filepath) {
        //   // Final path = dirname(dest) + returned value
        // }

        destCss: 'actual_files/font.styl',
        destFonts: 'actual_files/font.<%= ext %>',
        fonts: 'svg eot ttf',
        destFonts: function () {
          // Same behavior as router?
        }
      }
    }
  });

  grunt.loadTasks('../tasks');
  grunt.registerTask('default', 'font');
};