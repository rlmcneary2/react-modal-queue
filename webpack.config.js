"use strict";
/*
 * Copyright (c) 2019 Richard L. McNeary II
 *
 * MIT License
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


const babelOptions = require("./babel.config");
const moduleName = "react-modal-provider";
const path = require("path");
const plugins = require("./webpack.plugins");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");


const _OUTPUT_DIR = "dist";
const _SOURCE_DIR = "src";


/**
 * @module
 * This is a webpack 4 configuration file.
 */
const config = {
    devtool: "source-maps",
    entry: {
        index: `./${_SOURCE_DIR}/index.ts`
    },
    externals: [{
        react: {
            commonjs: "react",
            commonjs2: "react",
            amd: "react",
            root: "React"
        }
    }],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [
                    /(node_modules|bower_components)/
                ],
                use: [
                    {
                        loader: "babel-loader",
                        options: { cacheDirectory: true }
                    },
                    {
                        loader: "ts-loader",
                    }
                ]
            },
            {
                test: /\.jsx?$/,
                enforce: "pre",
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: "source-map-loader"
                    }
                ]
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                include: /\.min\.js$/,
                parallel: true,
                sourceMap: true,
                uglifyOptions: {
                    output: { comments: false }
                }
            })
        ]
    },
    output: {
        filename: `${moduleName}.js`,
        globalObject: "this", // temporary workaround for https://github.com/webpack/webpack/issues/6642
        library: { amd: moduleName, commonjs: moduleName, root: "ReactModalProvider" },
        libraryTarget: "umd",
        path: path.resolve(__dirname, _OUTPUT_DIR),
        publicPath: "/dist/",
        umdNamedDefine: true
    },
    resolve: {
        extensions: [".js", "json", ".jsx", "scss", ".ts", ".tsx"]
    },
    target: "web"
};


module.exports = env => {
    console.log(`webpack.config.js - env.NODE_ENV: '${env ? env.NODE_ENV : "undefined"}'.`);

    let mode = "development";
    if (!process.env.WEBPACK_SERVE && env && env.NODE_ENV === "production") {
        mode = "production";
    }

    config.mode = mode;
    console.log(`webpack.config.js - mode: '${config.mode}'.`);

    config.plugins = plugins(mode !== "production");

    return config;
};
