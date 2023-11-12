
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
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
        new FaviconsWebpackPlugin({
            logo: "./src/assets/image-logo.png",
            prefix: "favicons/",
            favicons: {
                icons: {
                    android: false,
                    appleIcon: false,
                    appleStartup: false,
                    coast: false,
                    favicons: true,
                    firefox: false,
                    windows: false,
                    yandex: false
                }
            }
        })
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    optimization: {
        minimize: true,
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: "vendor",
                    chunks: "all",
                },
                modelViewer: {
                    test: /[\\/]node_modules[\\/]@google[\\/]model-viewer[\\/]/,
                    name: "model-viewer",
                    chunks: "all"
                },
                three: {
                    test: /[\\/]node_modules[\\/]three[\\/]/,
                    name: "three",
                    chunks: "all"
                },
                jQuery: {
                    test: /[\\/]node_modules[\\/]jquery[\\/]/,
                    name: "jquery",
                    chunks: "all"
                },
                gsap: {
                    test: /[\\/]node_modules[\\/]gsap[\\/]/,
                    name: "gsap",
                    chunks: "all"
                },
                swiper: {
                    test: /[\\/]node_modules[\\/]swiper[\\/]/,
                    name: "swiper",
                    chunks: "all"
                },
            }
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            plugins: ["lodash"],
                            presets: [["@babel/env", { modules: false }]]
                        }
                    },
                    {
                        loader: "ts-loader",
                    }
                ],
                exclude: "/node_modules/",
            },
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false
                }
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
                exclude: [
                    "/node_modules/", 
                    path.resolve(__dirname, "./src/index.html"), 
                    path.resolve(__dirname, "./admin/index.html")
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader, 
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    },
                    // {
                    //     loader: "resolve-url-loader"
                    // },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader, 
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024, // 4kb
                    },
                },
                generator: {
                    filename: "images/[hash][ext][query]"
                }
            },
            {
                test: /\.(otf|ttf|woff|woff2)$/i,
                // use: "url-loader"
                type: "asset/resource",
                generator: {
                    filename: "fonts/[hash][ext][query]"
                }
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".mjs", ".jsx", ".js"],
    },
};