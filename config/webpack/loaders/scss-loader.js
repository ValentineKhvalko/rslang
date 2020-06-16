const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const scssLoader = {
  test: /\.(s?css)$/,
  use: [
    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
    {
      loader: 'css-loader', // translates CSS into CommonJS modules
      options: {
        sourceMap: !isProduction,
      },
    },
    {
      loader: 'postcss-loader', // Run postcss actions
      options: {
        plugins: function() {
          // postcss plugins, can be exported to postcss.config.js
          return [require('autoprefixer')];
        },
        sourceMap: !isProduction,
      },
    },
    {
      loader: 'sass-loader', // compiles Sass to CSS
      options: {
        sourceMap: !isProduction,
      },
    },
  ],
};

module.exports = scssLoader;
