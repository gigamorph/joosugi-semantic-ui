//var VersionFile = require('webpack-version-file-plugin');
var BannerWebpackPlugin = require('banner-webpack-plugin');
var path = require('path');
var npmPackage = require('./package');

function header() {
  return '// joosugi-semantic-ui DEV version ' + npmPackage.version + '\n// ' + 
    'Build: ' + new Date() + '\n\n';
}

module.exports = {
  output: {
    path: './dist',
    publicPath: '/dist/',
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'es2017']
      }
    }, {
      test: /\.less$/,
      loader: 'style-loader!css-loader!less-loader'
    }]
  },
  plugins: [
    new BannerWebpackPlugin({
      chunks: {
        'joosugi-semantic-ui': {
          beforeContent: header()
        }
      }
    })
  ]
};
