const audioLoader = {
    test: /\.(ogg|mp3|wav|mpe?g)$/i,
    loader: 'file-loader',
    options: {
        name: '[path][name].[ext]'
    }
};

module.exports = audioLoader;