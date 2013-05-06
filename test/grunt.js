module.exports = function (grunt) {
  grunt.initConfig({
    font: {
      'default': {
        src: ['test_files/*.svg'],

        // TODO: Contemplating sugar at fundamental stages
        // // Writes out files to font.svg, font.woff, font.ttf, font.css
        // dest: 'actual_files/font'
        destCss: 'actual_files/font.css',
        destEot: 'actual_files/font.eot',
        destSvg: 'actual_files/font.svg',
        destTtf: 'actual_files/font.ttf',
        destWoff: 'actual_files/font.woff'
      }
    }
  });

  grunt.loadTasks('../tasks');
  grunt.registerTask('default', 'font');
};