'use strict';

import localdb from 'store/localdb';

     * pageNameSpace: {
     *     buildHash
     *     buildVersion
     *     buildDate
     *     html
     *     js: {
     *         moduleName: moduleContent
     *     }
     *     css: {
     *         moduleName: moduleContent
     *     }
     * }
class Store {
    constructor() {
    }

    getCurrentBuildHash(pagename) {
        const pageStoreStr = localdb.getItem(pagename);
        if(pageStoreStr) {
            return JSON.parse(pageStoreStr)['buildHash'];
        }
        throw new Error('there is no data of page ${ pagename }');
    }

    writeToBuffer(pagename, data) {
    }
}

export default new Store();
