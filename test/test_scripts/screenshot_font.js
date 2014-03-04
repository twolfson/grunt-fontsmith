// Load in dependencies
var webpage = require('webpage'),
    __dirname = phantom.libraryPath;

// Grab the path of CSS to load
var args = phantom.args,
    cssPath = args[0],
    outputPath = args[1];

// Open a webpage with our CSS
var page = webpage.create(),
    cssURI = encodeURIComponent(cssPath);
page.open(__dirname + '/screenshot_font.html?' + cssURI, function (status) {
  // Take a screenshot of the content
  var screenshot = page.render(outputPath);

  // Exit the program
  phantom.exit(0);
});
