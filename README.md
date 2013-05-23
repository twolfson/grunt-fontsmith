# grunt-fontsmith

Grunt plugin for composing SVGs into multiple fonts, a character mapping, and CSS variables

## Getting Started
Install this grunt plugin via `npm install grunt-fontsmith` and add it to your `gruntfile`:

```javascript
// Inside of grunt.js/Gruntfile.js
grunt.loadNpmTasks('grunt-fontsmith');
```

## Dependencies
Currently, there is only the [icomoon-phantomjs][icomoon-phantomjs] engine.

[icomoon-phantomjs]: https://github.com/twolfson/icomoon-phantomjs

### icomoon-phantomjs
This requires installing [phantomjs][phantomjs] and having it accessible from your path (i.e. `phantomjs --version` will work).

[phantomjs]: http://www.phantomjs.org/

## Usage
```js
grunt.initConfig({
  font: {
    all: {
      // SVG files to reed in
      src: ['public/images/icons/*.png'],

      // Location to output CSS variables
      destCss: 'public/css/icons.styl',

      // Location to output fonts (expanded via brace expansion)
      destFonts: 'public/fonts/icons.{svg,woff,eot,ttf}'

      // Multiple CSS outputs supported (generated .styl and .json files)
      destCss: 'actual_files/font.{styl,json}',

      // Alternative formats (1)
      destCss:[
        'actual_files/font.styl',
        'actual_files/font.json'
      ],
      destFonts: [
        'actual_files/font.svg',
        'actual_files/font.woff',
        'actual_files/font.eot'
      ],

      // Alternative formats (2)
      destFonts: {
        // Override specific engines
        json: 'actual_files/font.less',
        styl: 'actual_files/font.json'
      },
      destFonts: {
        // Override specific engines
        'dev-svg': 'actual_files/font.svg',
        woff: 'actual_files/font.waffles',
        eot: 'actual_files/more.like.eof'
      },

      // OPTIONAL: Specify CSS format (inferred from destCss' extension by default)
          // (stylus, less, json)
      cssFormat: 'json',

      // Optional: Custom routing of font filepaths for CSS
      cssRouter: function (fontpath) {
        return 'mysubfolder/' + fontpath;
      },

      // Optional: Custom naming of font families for multi-task support
      fontFamily: 'my-icon-font',

      // OPTIONAL: Specify CSS options
      cssOptions: {}
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint using [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## Attribution
### Test files
<a href="http://thenounproject.com/noun/building-block/#icon-No5218" target="_blank">Building Block</a> designed by <a href="http://thenounproject.com/Mikhail1986" target="_blank">Michael Rowe</a> from The Noun Project

<a href="http://thenounproject.com/noun/eye/#icon-No5001" target="_blank">Eye</a> designed by <a href="http://thenounproject.com/DmitryBaranovskiy" target="_blank">Dmitry Baranovskiy</a> from The Noun Project

<a href="http://thenounproject.com/noun/moon/#icon-No2853" target="_blank">Moon</a> designed by <a href="http://thenounproject.com/somerandomdude" target="_blank">P.J. Onori</a> from The Noun Project

## License
Copyright (c) 2013 Todd Wolfson

Licensed under the MIT license.