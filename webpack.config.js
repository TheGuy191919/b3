const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

var node_dir = __dirname + '/node_modules';

module.exports = {
    entry: './src/main/js/index.js',
    devtool: 'sourcemaps',
    cache: true,
    output: {
        path: __dirname,
        filename: './src/main/resources/static/built/bundle.js'
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["env", "react"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [{
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: "[name]_[local]_[hash:base64]",
                            sourceMap: true,
                            minimize: true
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'svg-loader'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/main/resources/static/html/index.html",
            filename: "./index.html"
        })
    ]
};