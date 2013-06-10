// Load in dependencies
var webpage = require('webpage'),
    __dirname = phantom.libraryPath;

// Grab the path of CSS to load
var args = phantom.args,
    cssPath = args[0];

// Open a webpage with our CSS
var page = webpage.create(),
    __dirname =
page.open(__dirname + '/screenshot_font.html', function (status) {
  console.log(status);
  // Add in characters showcasing our font

  // Take a screenshot of the content
  var screenshot = page.renderBase64('png');
  console.log(screenshot, 'yy');

  // Exit the program
  phantom.exit(0);
});