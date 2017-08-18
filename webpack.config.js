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
            title: "Calendar"
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets:
            [
                "main.css",
                "fabric.min.css",
                "/js/packs/solid.js",
                "/js/fontawesome.js",
                "https://apis.google.com/js/api.js",
                "https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/4.10/css/fabric.min.css"
            ],
            append: false
        }),
        new webpack.HotModuleReplacementPlugin(),

    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        historyApiFallback: true,
        hot: true,
        host: "0.0.0.0"
    },
      devtool: "source-map"


}

