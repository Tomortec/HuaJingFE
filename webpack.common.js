
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ProvidePlugin } = require("webpack");

module.exports = {
    entry: {
        index: "./src/index.tsx",
        admin: "./admin/index.tsx"
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: "./src/index.html",
            filename: "index.html",
            chunks: ["index"]
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: "./admin/index.html",
            filename: "admin.html",
            chunks: ["admin"]
        }),
        new MiniCssExtractPlugin(),
        new ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
        }),
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        clean: true,
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false
                }
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: "/node_modules/",
            },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024, // 4kb
                    },
                },
            },
            {
                test: /\.woff2?$/i,
                type: "asset/resource",
            },
            {
                test: /\.(glb|gltf)$/i,
                type: "asset/resource",
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".mjs", ".jsx", ".js"],
    },
};