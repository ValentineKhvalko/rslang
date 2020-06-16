const path = require('path');

const imageLoader = {
  test: /\.(gif|png|jp(e*)g|svg)$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 8000, // Convert images < 8kb to base64 strings
        fallback: 'file-loader',
        name: 'images/[name].[contenthash:8].[ext]',
      },
    },
  ],
};

module.exports = imageLoader;
