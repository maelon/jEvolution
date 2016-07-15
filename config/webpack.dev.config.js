'use strict'

const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

let config = require('./webpack.config.js');
config.entry['index'] = [
    'webpack-dev-server/client?http://localhost:8000/',
    'webpack/hot/dev-server',
    path.resolve(__dirname, '../src/index.js')
];
config.output = {
    'path': path.resolve(__dirname, '../dev'),
    'filename': '[name].[hash].js'
};
config.devtool = 'inline-source-map';
config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new htmlWebpackPlugin({
        'chunks': ['index'],
        'filename': 'index.html',
        'template': path.resolve(__dirname, '../src/index.html'),
        'inject': true
    })
]);

module.exports = config;
