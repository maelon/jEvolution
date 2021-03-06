'use strict'

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    'entry': {
        'index': [ path.resolve(__dirname, '../src/index.js') ],
        'loader': [ path.resolve(__dirname, '../src/loader/index.js') ],
        'store': [ path.resolve(__dirname, '../src/store/index.js') ],
        'updater': [ path.resolve(__dirname, '../src/updater/index.js') ]
    },
    'output': {
        'path': path.resolve(__dirname, '../dist'),
        'filename': '[name].js',
        'sourceMapFilename': '[name].js.map'
    },
    'devtool': 'source-map',
    'resolve': {
        'alias': {
            'loader': path.resolve(__dirname, '../src/loader'),
            'mounter': path.resolve(__dirname, '../src/mounter'),
            'store': path.resolve(__dirname, '../src/store'),
            'updater': path.resolve(__dirname, '../src/updater')
        },
		'extensions': ['', '.js']
	},
    'externals': {
    },
    'resolveLoader': {
        'modulesDirectories': [path.resolve(__dirname, '../node_modules')]
    },
    'module': {
        //preLoaders: [
            //{
                //test: /\.jsx?$/, 
                //exclude: /(node_modules|bower_components)/,
                //loader: 'eslint'
            //}
        //],
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: 'assets/[name].[ext]'
                }
            },
            {
                test: /\.css$/,
                exclude: /(node_modules|bower_components)/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }
        ]
    },
    'plugins': [
        new ExtractTextPlugin('[name].css'),
        //new webpack.optimize.CommonsChunkPlugin({
            //name: 'config',
            //chunks: ['config', 'app'],
            //filename: 'config.js'
        //}),
    ]
}
