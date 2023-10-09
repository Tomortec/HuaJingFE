const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const path = require('path');
const MockjsWebpackPlugin = require('mockjs-webpack-plugin');

module.exports = merge(common, {
    mode: "development",
    devtool: "cheap-source-map",
    devServer: {
        historyApiFallback: true,
        static: "./dist",
        hot: true,
        proxy: {
            "/adminApi": "http://localhost:3000/"
        }
    },
    output: {
        publicPath: "/"
    },
    plugins: [
        new MockjsWebpackPlugin({
            path: path.join(__dirname, "./admin/__mock__"),
            port: 3000
        })
    ]
});