'use strict';

import localdb from 'store/localdb';

class Store {
    constructor() {
    }

    getCurrentBuildHash(pagename) {
        const pageStoreStr = localdb.getItem(pagename);
        if(pageStoreStr) {
            return JSON.parse(pageStoreStr)['buildHash'];
        }
        throw new Error(`there is no data of page ${ pagename }`);
    }

    getPageStorage(pagename) {
        const store = localdb.getItem(pagename);
        if(store) {
            return JSON.parse(store);
        }
        return null;
    }

    writeToBuffer(pagename, data) {
        this._writeToStorage(pagename, JSON.stringify(data));
    }

    _writeToStorage(pagename, data) {
        localdb.setItem(pagename, data);
    }
}

export default new Store();
