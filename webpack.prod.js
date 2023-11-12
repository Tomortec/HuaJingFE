const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    output: {
        filename: "js/[name].[chunkhash].bundle.js",
        chunkFilename: "js/chunks/[name].[chunkhash].js",
        sourceMapFilename: "sourceMaps/[file].map[query]",
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ["*.LICENSE.txt"],
        }),
    ],
});