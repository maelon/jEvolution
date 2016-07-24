'use strict'

const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

let config = require('./webpack.config.js');
config.output = {
    'path': path.resolve(__dirname, '../dist/[hash]'),
    'filename': '[name].js',
    'publicPath': 'http://localhost:8000/work/dist/[hash]/'
};
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
        'template': path.resolve(__dirname, '../src/index.ejs'),
        'inject': true
    })
]);

module.exports = config;
