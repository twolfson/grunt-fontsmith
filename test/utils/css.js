var fs = require('fs');
var expect = require('chai').expect;
var stylus = require('stylus');

exports._compileCss = function (options) {
  // Strip out fonts that are not going to be tested
  var css = fs.readFileSync(options.cssFilepath, 'utf8');
  var fontFormat = options.fontFormat;
  if (fontFormat !== 'eot') {
    var eotName = options.eotName || 'font.eot';
    css = css.replace(new RegExp('\\s+src:url\\("' + eotName + '"\\);'), '');
    css = css.replace(new RegExp('\\s*url\\("' + eotName + '\\?#iefix"\\) format\\("embedded-opentype"\\),\\s*'), '');
  }
  if (fontFormat !== 'woff') {
    var woffName = options.woffName || 'font.woff';
    css = css.replace(new RegExp('\\s*url\\(' + woffName + '"\\) format\\("woff"\\),\\s*'), '');
  }
  if (fontFormat !== 'ttf') {
    var ttfName = options.ttfName || 'font.ttf';
    css = css.replace(new RegExp('\\s*url\\("' + ttfName + '"\\) format\\("truetype"\\),\\s*'), '');
  }
  if (fontFormat !== 'svg') {
    // Guarantee no-commas for font formats
    var svgName = options.svgName || 'font.svg';
    css = css.replace(',', ';');
    css = css.replace(new RegExp('\\s*url\\("' + svgName + '#icomoon"\\) format\\("svg"\\);\\s*/'), '');
  }

  // Replace font path with our font path
  // var fontFilepath = __dirname + '/actual_files/single/font.svg';
  var fontFilepath = options.fontFilepath;
  var fontname = options[fontFormat + 'Name'] || 'font.' + fontFormat;
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
