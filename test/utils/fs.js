var fs = require('fs');

exports.loadLines = function (namespace, filepath) {
  before(function loadLinesFn () {
    var content = fs.readFileSync(filepath, 'utf8');
    var lines = content.split(/\n/g);
    this[namespace] = lines;
  });
};

exports.loadActualLines = function (filepath) {
  exports.loadLines('actualLines', filepath);
};

exports.loadExpectedLines = function (filepath) {
  exports.loadLines('expectedLines', filepath);
};
