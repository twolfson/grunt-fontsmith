// Grab the font we are screenshotting
var args = phantom.args,
    filepath = args[0],
    fontType = args[1];

// Determine what the CSS will look like
var fontCss = 'svg';
if (fontType === 'eot') {

}
console.log(filepath, fontType);

phantom.exit(0);