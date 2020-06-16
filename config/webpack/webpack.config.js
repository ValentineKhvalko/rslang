const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const { scssLoader, jsLoader, imageLoader, audioLoader } = require('./loaders');

const isProduction = process.env.NODE_ENV === 'production';
const rootPath = process.cwd();
const pathResolve = (...args) => path.resolve(rootPath, ...args);

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    filename: isProduction ? 'js/[name].[contenthash:8].bundle.js' : '[name].bundle.js',
    path: pathResolve('dist'),
  },
  resolve: {
    extensions: ['.js'],
    modules: [pathResolve('src'), 'node_modules'],
    alias: {
      '@app': pathResolve('src'),
      '@config': pathResolve('config'),
      '@assets': pathResolve('assets'),
    },
  },
  devtool: isProduction ? undefined : 'inline-source-map',
  devServer: isProduction
    ? undefined
    : {
      contentBase: './public',
      historyApiFallback: true,
      open: true,
    },
  module: {
    rules: [jsLoader, scssLoader, imageLoader, audioLoader]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/template/index.html'
    })
  ]
};
