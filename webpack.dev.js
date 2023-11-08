const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const path = require('path');
const webpack = require("webpack");
const MockjsWebpackPlugin = require('mockjs-webpack-plugin');

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
        publicPath: "/"
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("development")
        }),
        new MockjsWebpackPlugin({
            path: path.join(__dirname, "./admin/__mock__"),
            port: 3000
        }),
        new MockjsWebpackPlugin({
            path: path.join(__dirname, "./src/__mock__"),
            port: 3001
        })
    ]
});