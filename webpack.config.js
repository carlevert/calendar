const path = require("path");
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

module.exports = {
    entry: {
        bundle: "./index.tsx",
        scss: "./scss/main.scss"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        publicPath: "/"

    },
    resolve: {
        extensions: [
            ".ts",
            ".tsx",
            ".js",
            ".json",
            ".scss"
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader"
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract([
                    "css-loader",
                    "sass-loader"
                ])
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Calendar"
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets:
            [
                "http://localhost:8080/styles.css",
                "http://localhost:8080/fabric.min.css",
                "http://localhost:8080/js/packs/solid.js",
                "http://localhost:8080/js/fontawesome.js",
                "https://apis.google.com/js/api.js",
            ],
            append: false,
            publicPath: false
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("styles.css"),
        new WriteFilePlugin({
            test: /\.css$/
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        historyApiFallback: true,
        hot: true,
        host: "0.0.0.0"
    },
    devtool: "source-map"


}

