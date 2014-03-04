var path = require('path');

exports.compileCss = function (options) {
  // Strip out fonts that are not going to be tested
  var css = fs.readFileSync(options.cssPath;
  var format = options.format;
  if (format !== 'eot') {
    css = css.replace(/\s+src:url\("font.eot"\);/, '');
    css = css.replace(/\s*url\("font.eot\?#iefix"\) format\("embedded-opentype"\),\s*/, '');
  }
  if (format !== 'woff') {
    css = css.replace(/\s*url\("font.woff"\) format\("woff"\),\s*/, '');
  }
  if (format !== 'ttf') {
    css = css.replace(/\s*url\("font.ttf"\) format\("truetype"\),\s*/, '');
  }
  if (format !== 'svg') {
    // Guarantee no-commas for font formats
    css = css.replace(',', ';');
    css = css.replace(/\s*url\("font.svg#icomoon"\) format\("svg"\);\s*/, '');
  }

  // Replace font path with our font path
  // var dir = __dirname + '/actual_files/';
  // var filename = 'single/font.svg';
  var dir = options.dir;
  var filepath = path.join(dir, options.filename);
  var fontname = 'font.' + format;
  css = css.replace(fontname,  filepath);

  // Assert our replacements were successful
  expect(css).to.contain(dir, 'Actual stylus has not replaced "' + fontname + '" with "' + filepath + '" successfully');

  // Return the css
  return css;
};

exports.compileStylus = function (options) {
  // Prepare the Stylus
  var baseStyl = exports.compileCss(options);

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
};
