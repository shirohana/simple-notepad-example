const webpack = require('webpack');
const commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
const providePlugin = new webpack.ProvidePlugin({
  _: "lodash"
});

module.exports = {
  output: {
    filename: '[name].js',
    path: './dist/client/assets'
  },
  plugins: [commonsPlugin, providePlugin],
  module: {
    loaders: [{
      test: /\.vue$/,
      loader: 'vue-loader',
    }, {
      test: /\.(jade|pug)$/,
      loader: 'pug-loader'
    }, {
      test: /\.styl$/,
      loader: 'style-loader!css-loader!stylus-loader'
    }, {
      test: /\.sass$/,
      loader: 'style-loader!css-loader!sass-loader'
    }, {
      test: /\.ts/,
      loader: 'ts-loader'
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=8192&name=images/[hash].[ext]&publicPath=assets/'
    }]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.js'
    },
    extensions: ['', '.webpack.js', '.web.js', '.vue', '.js']
  },
  // devtool: '#eval-source-map'
};
