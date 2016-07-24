'use strict';

import Loader from 'loader';
import store from 'store';

class Updater {
    constructor(pagename, vlisturl, policy) {
        this._pageName = pagename;
        this._vlist_remoteURL = vlisturl + '?rand=' + Math.random().toString().slice(2);
        this._defaultPolicy = policy;
    }

    update() {
        const vlistURL = this._vlist_remoteURL;
        const loader = new Loader({ 
            'urls': [ vlistURL ] 
        });
        loader.onLoad = result => {
            if(result[vlistURL]['state'] === 'success') {
                const vlist = JSON.parse(result[vlistURL]['result']);
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
        const that = this;
        const vinfo_url = vlist['remoteURL'] + vlist['latestHash'] + '/vinfo.json?rand=' + Math.random().toString().slice(2);
        const loader = new Loader({ 'urls': [ vinfo_url ] });
        loader.onLoad = result => {
            if(result[vinfo_url]['state'] === 'success') {
                let shouldUpdate = false;
                const vinfo = JSON.parse(result[vinfo_url]['result']);
                if(vinfo['updatePolicy'] === 'default') {
                    if(that._defaultPolicy && that._defaultPolicy.shouldUpdateByTime(store.getLastUpdateTime(that._pageName))) {
                        shouldUpdate = true;
                    }
                } else {
                    const shouldUpdateByTime = window.eval(vinfo['updatePolicy']);
                    if(shouldUpdateByTime(store.getLastUpdateTime(that._pageName))) {
                        shouldUpdate = true;
                    }
                }
                if(shouldUpdate && vinfo['buildHash'] === vlist['latestHash']) {
                    console.log(`get vinfo buildDate: ${ vinfo['buildDate'] } buildVersion: ${ vinfo['buildVersion'] }`);
                    const resourceList = [];
                    for(let i = 0; i < vinfo['cacheList'].length; i++) {
                        resourceList.push(`${ vlist['remoteURL'] }${ vinfo['buildHash'] }/${ vinfo['cacheList'][i] }`);
                    }
                    const resLoader = new Loader({ 'urls': resourceList });
                    resLoader.onLoad = result => {
                        if(result['success']) {
                            that._writeToStoreBuffer(vinfo, result, vinfo['storePolicy']);
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
                    console.log('update policy limit or vinfo error hash version');
                }
            } else {
                console.log(`get ${ vlist['latestHash' ]} vinfo failed`);
            }
        };
        loader.start();
    }

    _writeToStoreBuffer(vinfo, resource, storepolicy) {
        const data = {};
        data['buildHash'] = vinfo['buildHash'];
        data['buildVersion'] = vinfo['buildVersion'];
        data['buildDate'] = vinfo['buildDate'];
        for(let s in resource) {
            if((new RegExp(`${ this._pageName }\.html$`, 'i')).test(s)) {
                data['html'] = resource[s]['result'];
            } else if((/\.js$/i).test(s)) {
                data['js'] === undefined && (data['js'] = {});
                data['js'][s] = resource[s]['result'];
            } else if((/\.css$/i).test(s)) {
                data['css'] === undefined && (data['css'] = {});
                data['css'][s] = resource[s]['result'];
            }
        }
        if(storepolicy !== 'default') {
            storepolicy = window.eval(storepolicy);
        }
        store.writeToBuffer(this._pageName, data, storepolicy);
    }
}

export default Updater;
