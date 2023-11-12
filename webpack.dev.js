const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const webpack = require("webpack");

module.exports = merge(common, {
    mode: "development",
    devtool: "cheap-source-map",
    devServer: {
        historyApiFallback: true,
        static: "./dist",
        hot: true,
        proxy: {
            "/admin": "http://localhost:6060/",
            "/api": "http://localhost:6060/"
        }
    },
    output: {
        publicPath: "/",
        filename: "[name].bundle.js",
        chunkFilename: "[name].bundle.js",
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("development")
        }),
    ]
});