var path = require("path");
var webpack = require("webpack")
var HtmlWebpackPlugin = require("html-webpack-plugin")
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

module.exports = {
    entry: {
        bundle: "./index.tsx"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    resolve: {
        extensions: [
            ".ts",
            ".tsx",
            ".js",
            ".json"
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Boilerplate App 2"
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets:
            [
                "main.css"

            ],
            append: true
        }),
        new webpack.HotModuleReplacementPlugin(),

    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        historyApiFallback: true,
        hot: true
    }


}