var fs = require('fs');
var expect = require('chai').expect;
var stylus = require('stylus');

exports._compileCss = function (options) {
  // Strip out fonts that are not going to be tested
  var css = fs.readFileSync(options.cssFilepath, 'utf8');
  var fontFormat = options.fontFormat;
  var fontNames = options.fontNames || {};
  if (fontFormat !== 'eot') {
    var eotName = fontNames.eotName || 'font.eot';
    css = css.replace(new RegExp('\\s+src:url\\("' + eotName + '"\\);', 'g'), '');
    css = css.replace(new RegExp('\\s*url\\("' + eotName + '\\?#iefix"\\) format\\("embedded-opentype"\\),\\s*', 'g'), '');
    expect(css).to.not.contain(eotName);
  }
  if (fontFormat !== 'woff') {
    var woffName = fontNames.woffName || 'font.woff';
    console.log(woffName);
    css = css.replace(new RegExp('\\s*url\\(' + woffName + '"\\) format\\("woff"\\),\\s*', 'g'), '');
    expect(css).to.not.contain(woffName);
  }
  if (fontFormat !== 'ttf') {
    var ttfName = fontNames.ttfName || 'font.ttf';
    css = css.replace(new RegExp('\\s*url\\("' + ttfName + '"\\) format\\("truetype"\\),\\s*', 'g'), '');
    expect(css).to.not.contain(ttfName);
  }
  if (fontFormat !== 'svg') {
    // Guarantee no-commas for font formats
    var svgName = fontNames.svgName || 'font.svg';
    css = css.replace(',', ';');
    css = css.replace(new RegExp('\\s*url\\("' + svgName + '#icomoon"\\) format\\("svg"\\);\\s*/', 'g'), '');
    expect(css).to.not.contain(svgName);
  }

  // Replace font path with our font path
  // var fontFilepath = __dirname + '/actual_files/single/font.svg';
  var fontFilepath = options.fontFilepath;
  var fontname = fontNames[fontFormat + 'Name'] || 'font.' + fontFormat;
  // console.log(css);
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
