'use strict';

import localdb from 'store/localdb';
import storePolicy from 'store/storePolicy';

class Store {
    constructor() {
    }

    getCurrentBuildHash(pagename) {
        const pageStoreStr = localdb.getItem(pagename);
        if(pageStoreStr) {
            return JSON.parse(pageStoreStr)['buildHash'];
        }
        return null;
        //throw new Error(`there is no data of page ${ pagename }`);
    }

    getLastUpdateTime(pagename) {
        const pageStoreStr = localdb.getItem(pagename);
        if(pageStoreStr) {
            return JSON.parse(pageStoreStr)['updateTime'];
        }
        return null;
        //throw new Error(`there is no data of page ${ pagename }`);
    }

    getPageStorage(pagename) {
        const store = localdb.getItem(pagename);
        if(store) {
            return JSON.parse(store);
        }
        return null;
    }

    writeToBuffer(pagename, data, storepolicy) {
        const pageStoreStr = localdb.getItem(pagename);
        if(storepolicy === 'default') {
            storepolicy = storePolicy;
        }
        if(pageStoreStr) {
            const hash = JSON.parse(pageStoreStr)['buildHash'];
            if(data['buildHash'] !== hash) {
                data['updateTime'] = +new Date();
                this._writeToStorage(pagename, JSON.stringify(data), storepolicy);
            }
        } else {
            data['updateTime'] = +new Date();
            this._writeToStorage(pagename, JSON.stringify(data), storepolicy);
        }
    }

    _writeToStorage(pagename, data, storepolicy) {
        if(storepolicy && storepolicy.shouldStore()) {
            localdb.setItem(pagename, data);
        }
    }
}

export default new Store();
