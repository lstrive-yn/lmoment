const path = require("path");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: "production",
    entry: './index.js',
    output: {
        filename: "lmoment.js",
        path: path.join(__dirname, "./")
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                test: /\.js(\?.*)?$/i,
                exclude: /\/node_modules/,
                uglifyOptions: {
                    warnings: false,   
                    compress: {
                        drop_console: true
                    }
                }
            })
        ],
    },
}