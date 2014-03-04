var fs = require('fs');
var expect = require('chai').expect;
var stylus = require('stylus');

exports._compileCss = function (options) {
  // Strip out fonts that are not going to be tested
  var css = fs.readFileSync(options.cssFilepath, 'utf8');
  var fontFormat = options.fontFormat;
  if (fontFormat !== 'eot') {
    css = css.replace(/\s+src:url\("font.eot"\);/, '');
    css = css.replace(/\s*url\("font.eot\?#iefix"\) format\("embedded-opentype"\),\s*/, '');
  }
  if (fontFormat !== 'woff') {
    css = css.replace(/\s*url\("font.woff"\) format\("woff"\),\s*/, '');
  }
  if (fontFormat !== 'ttf') {
    css = css.replace(/\s*url\("font.ttf"\) format\("truetype"\),\s*/, '');
  }
  if (fontFormat !== 'svg') {
    // Guarantee no-commas for font formats
    css = css.replace(',', ';');
    css = css.replace(/\s*url\("font.svg#icomoon"\) format\("svg"\);\s*/, '');
  }

  // Replace font path with our font path
  // var fontFilepath = __dirname + '/actual_files/single/font.svg';
  var fontFilepath = options.fontFilepath;
  var fontname = 'font.' + fontFormat;
  css = css.replace(fontname,  fontFilepath);

  // Assert our replacements were successful
  expect(css).to.contain(fontFilepath, '`compileCss` has not replaced "' + fontname + '" with "' + fontFilepath + '" successfully');

  // Return the css
  return css;
};

exports.compileStylus = function (options) {
  before(function compileStylusFn (done) {
    // Prepare the Stylus
    var baseStyl = exports._compileCss(options);

    // Render the stylus
    var charStyl = [
      '.icon-eye',
      '  icon($eye)',
      '.icon-building_block',
      '  icon($building_block)',
      '.icon-moon',
      '  icon($moon)'
    ].join('\n');
    var that = this;
    stylus.render(baseStyl + '\n' + charStyl, function (err, css) {
      // Save the CSS for later and callback
      that.css = css;
      done(err);
    });
  });
};
