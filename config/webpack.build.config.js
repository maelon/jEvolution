'use strict'

const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let config = require('./webpack.config.js');
config.devtool = false;
config.plugins = config.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
        'compress': {
            'warnings': false
        },
        'exclude': /^config\.js$/
    }),
    new htmlWebpackPlugin({
        'chunks': ['index'],
        'filename': 'index.html',
        'template': path.resolve(__dirname, '../src/index.html'),
        'inject': true
    })
]);

module.exports = config;
