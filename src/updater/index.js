'use strict';

import Loader from 'loader';
import store from 'store';

class Updater {
    constructor(pagename, vlisturl) {
        this._pageName = pagename;
        this._vlist_remoteURL = vlisturl;
    }

    update() {
        const loader = new Loader({ 'urls': [ this._vlist_remoteURL ] });
        loader.onLoad = result => {
            if(result[this._vlist_remoteURL]['state'] === 'success') {
                const vlist = JSON.parse(result[this._vlist_remoteURL]['result']);
                if(this._checkShouldUpdate(vlist['latestHash'])) {
                    this._loadNewVersion(vlist);
                } else {
                }
            } else {
                console.log('get vlist failed');
            }
        };
        loader.start();
    }

    _checkShouldUpdate(hash) {
        if(hash && store.getCurrentBuildHash(this._pageName) !== hash) {
            return true;
        }
        return false;
    }

    _loadNewVersion(vlist) {
        const vinfo_url = vlist['remoteURL'] + vlist['latestHash'] + '/vinfo.json';
        const loader = new Loader({ 'urls': [ vinfo_url ] });
        loader.onLoad = result => {
            if(result[this._vlist_remoteURL]['state'] === 'success') {
                const vinfo = JSON.parse(result[vinfo_url]['result']);
                if(vinfo['buildHash'] === vlist['latestHash']) {
                    console.log(`get vinfo buildDate: ${ vinfo['buildDate'] } buildVersion: ${ vinfo['buildVersion'] }`);
                    const resourceList = [];
                    for(let i = 0; i < vinfo['cacheList'].length; i++) {
                        resourceList.push(`${ vlist['remoteURL'] }${ vinfo['buildHash'] }/${ vinfo['cacheList'][i] }`);
                    }
                    const resLoader = new Loader({ 'urls': [ resourceList ] });
                    resLoader.onLoad = result => {
                        if(result['success']) {
                            this._writeToStoreBuffer(vinfo, result);
                        } else {
                            const errorList = [];
                            for(let s in result) {
                                if(result[s]['state'] === 'fail') {
                                    errorList.push(s);
                                }
                            }
                            console.log(`resource loaded error: ${ errorList }`, result);
                        }
                    }
                    resLoader.start();
                } else {
                    console.log('vinfo error hash version');
                }
            } else {
                console.log(`get ${ vlist['latestHash' ]} vinfo failed`);
            }
        };
        loader.start();
    }

    _writeToStoreBuffer(vinfo, resource) {
        const data = {};
        data['buildHash'] = vinfo['buildHash'];
        data['buildVersion'] = vinfo['buildVersion'];
        data['buildDate'] = vinfo['buildDate'];
        for(let s in resource) {
            if((new RegExp(`${ this._pageName }\.html$`, 'i')).test(s)) {
                data['html'] = resource[s];
            } else if((/\.js$/i).test(s)) {
                data['js'] === undefined && (data['js'] = {});
                data['js'][s] = resource[s];
            } else if((/\.css$/i).test(s)) {
                data['css'] === undefined && (data['css'] = {});
                data['css'][s] = resource[s];
        }
        store.writeToBuffer(this._pageName, data);
    }
}

export default Updater;
