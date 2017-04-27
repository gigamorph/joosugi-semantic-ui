var path = require('path');
const webpack = require('webpack');

function header() {
  var gitDesc = process.env.GIT_DESC;
  var text = 'joosugi-semantic-ui ' + gitDesc + ' built ' + new Date();
  return '// ' + text + '\n\n';
}
process.traceDeprecation = true;

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'es2017']
        }
      }]
    }, {
      test: /\.less$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'less-loader'
      }]
    }]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: header(),
      test: /\.js$/,
      raw: true,
      entryOnly: true
    })
  ]
};
