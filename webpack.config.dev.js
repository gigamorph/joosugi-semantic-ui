var config = require('./webpack.config.common.js');

config.entry = {
  'joosugi-semantic-ui': ['./src/js/main.js', './examples/example.js'],
};

module.exports = config;
