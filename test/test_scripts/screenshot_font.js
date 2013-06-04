// Grab the font we are screenshotting
var args = phantom.args,
    filepath = args[0],
    fontType = args[1];

// TODO: Need to think about how to transfer characters for a bit...

// Determine what the CSS will look like
var fontCss = 'format("' + fontType + '")';
if (fontType === 'eot') {
  fontCss = 'format("embedded-opentype")';
} else if (fontType === 'ttf') {
  fontCss = 'format("truetype")';
}

console.log(filepath, fontType);

phantom.exit(0);