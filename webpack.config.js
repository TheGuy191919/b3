var path = require('path');

var node_dir = __dirname + '/node_modules';

module.exports = {
    entry: './src/main/js/index.js',
    devtool: 'sourcemaps',
    cache: true,
    debug: true,
    output: {
        path: __dirname,
        filename: './src/main/resources/static/built/bundle.js'
    },
    module: {
        loaders: [
            {
            	test: /.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                }
            }, {
                test: /\.css$/,
                exclude: /(node_modules)/,
                loader: 'style-loader!css-loader'
            }, {
                test: /\.svg$/,
                exclude: /(node_modules)/,
                loader: 'svg-loader'
            }
        ]
    }
};