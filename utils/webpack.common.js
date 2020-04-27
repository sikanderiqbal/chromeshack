/* eslint-disable */
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const LicenseCheckerWebpackPlugin = require("license-checker-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    stats: "errors-only",

    entry: {
        content: "./src/app/content.ts",
        background: "./src/app/background.ts",
        popup: "./src/app/popup.ts",
    },

    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name].js",
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.tsx?$/,
                use: [
                    { loader: "cache-loader" },
                    {
                        loader: "thread-loader",
                        options: { workers: require("os").cpus().length - 1, poolTimeout: Infinity },
                    },
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            experimentalWatchApi: true,
                            happyPackMode: true,
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            __REACT_DEVTOOLS_GLOBAL_HOOK__: "({ isDisabled: true })",
        }),
        new ForkTsCheckerWebpackPlugin({
            useTypescriptIncrementalApi: true,
            checkSyntacticErrors: true,
            silent: true,
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
        new CopyPlugin([
            { from: "./src/images", to: "images" },
            { from: "./src/app/popup.html", to: "." },
            { from: "./src/release_notes.html", to: "." },
            { from: "./src/manifest.json", to: "." },
            { from: "./*.md", to: "." },
        ]),
        new LicenseCheckerWebpackPlugin({
            outputFilename: "ThirdPartyLicenses.txt",
            allow: "(Apache-2.0 OR BSD-2-Clause OR BSD-3-Clause OR MIT OR MPL-2.0)",
        }),
    ],
};
