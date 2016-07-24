'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fs = require('fs');
var exec = require('child_process').exec;

const webpackConfig = require('./config/webpack.build.config.js');

const vlistPath = './dist/vlist.json';
let versionHash = '';
let versionTime = 0;
const remoteURL = 'http://localhost:8000/work/dist/';

const getCacheFiles = (pwd) => {
    const cacheFiles = [];

    const iterateFiles = (dir) => {
        const files = fs.readdirSync(dir);
        for(let i = 0 ; i < files.length; i++) {
            try {
                const stat = fs.statSync(dir + files[i]);
                if(stat.isFile()) {
                    if((/.(html|js(x|.map)?|css)$/i).test(files[i])) {
                        cacheFiles.push(files[i]);
                    }
                } else if(stat.isDirectory()){
                    iterateFiles(dir + files[i]);
                }
            } catch(e) {
            }
        }
    }
    iterateFiles(pwd);

    return cacheFiles;
};

gulp.task('default', ['build', 'makeVInfo', 'updateVList', 'copyAssets'], (error, result) => {
    if(!error) console.log('build complete');
});

gulp.task('build', endcall => {
    webpack(webpackConfig, (error, result) => {
        if(error) {
            console.log(error);
        }
        versionHash = result.hash;
        versionTime = (new Date()).getTime();
        endcall();
    });
});

gulp.task('makeVInfo', ['build'], endcall => {
    const fd = fs.openSync(`./dist/${ versionHash }/vinfo.json`, 'w+');
    fs.closeSync(fd);
    const vinfo = {};
    vinfo['buildHash'] = versionHash;
    vinfo['buildDate'] = versionTime;
    vinfo['buildVersion'] = '';
    vinfo['buildVersion'] = '';
    vinfo['updatePolicy'] = 'default';
    vinfo['storePolicy'] = 'default';
    vinfo['cacheList'] = getCacheFiles(`./dist/${ versionHash }/`);
    fs.writeFileSync(`./dist/${ versionHash }/vinfo.json`, JSON.stringify(vinfo, null, '\t'), 'utf8');
    endcall();
});

gulp.task('updateVList', ['build', 'makeVInfo'],  endcall => {
    fs.stat(vlistPath, (error, result) => {
        if(error) {
            const fd = fs.openSync(vlistPath, 'w+');
            fs.closeSync(fd);
        }

        const content = fs.readFileSync(vlistPath, 'utf8');
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
        vlist['remoteURL'] = remoteURL;
        fs.writeFileSync(vlistPath, JSON.stringify(vlist, null, '\t'), 'utf8');

        endcall();
    });
});

gulp.task('copyAssets', ['build'], endcall => {
    exec(`cp -R ./src/assets ./dist/${ versionHash }/`);
    endcall();
});
