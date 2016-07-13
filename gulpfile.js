'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fs = require('fs');

const webpackConfig = require('./webpack.config.js');

let versionHash = '';
let versionTime = 0;

gulp.task('default', ['build', 'updateVersionList'], (error, result) => {
    if(!error) console.log('build complete');
});

gulp.task('build', endcall => {
    webpack(webpackConfig, (error, result) => {
        console.log('build', result.hash);
        versionHash = result.hash;
        versionTime = (new Date()).getTime();
        endcall();
    });
});

gulp.task('updateVersionList', ['build'],  endcall => {
    console.log('updateVersionList', versionHash, versionTime);
    fs.stat('./dist/vlist.json', (error, result) => {
        if(error) {
            const fd = fs.openSync('./dist/vlist.json', 'w+');
            fs.closeSync(fd);
        }

        const content = fs.readFileSync('./dist/vlist.json', 'utf8');
        let vlist;
        if(content) {
            vlist = JSON.parse(content);
        } else {
            vlist = {};
        }

        const params = process.argv.slice(2);
        for(let i = 0; i < params.length; i++) {
            if(params[i] === '--reversion') {
                if(i === params.length - 1) {
                    throw new Error('no reversion hash');
                }
                try {
                    const stat = fs.statSync('./dist/' + params[i + 1]);
                    if(stat.isDirectory()) {
                        versionHash = params[i + 1];
                    }
                } catch (e) {
                }
                break;
            }
        }

        vlist['latestHash'] = versionHash;
        vlist['latestDate'] = versionTime;
        fs.writeFileSync('./dist/vlist.json', JSON.stringify(vlist, null, '\t'), 'utf8');

        endcall();
    });
});
