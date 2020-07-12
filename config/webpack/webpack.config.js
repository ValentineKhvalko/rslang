const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const { scssLoader, jsLoader, imageLoader, audioLoader } = require('./loaders');

const isProduction = process.env.NODE_ENV === 'production';
const rootPath = process.cwd();
const pathResolve = (...args) => path.resolve(rootPath, ...args);

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    'page1':'./src/index.js',
    'page2': './src/savannah.js',
    'page3': './src/sprint.js',
    'page4': './src/speak-it.js',
    'page5': './src/audio-call.js',
    'page6': './src/promo.js'
  },
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
      chunks: ['page1'],
      template: 'src/template/index.html',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['page2'],
      template: 'src/template/savannah.html',
      filename: 'savannah.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['page3'],
      template: 'src/template/sprint.html',
      filename: 'sprint.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['page4'],
      template: 'src/template/speak-it.html',
      filename: 'speak-it.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['page5'],
      template: 'src/template/audio-call.html',
      filename: 'audio-call.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['page6'],
      template: 'src/template/promo.html',
      filename: 'promo.html'
    }),
  ]
};
