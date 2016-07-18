'use strict'

class LocalDB {
    /**
     * localStorage
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
     *
    */
    constructor() {
        this.localdb = window.localStorage;
    }

    key(n) {
        return this.localdb.key(n);
    }

    getItem(key) {
        return this.localdb.getItem(key);
    }

    setItem(key, value) {
        this.localdb.setItem(key, value);
    }

    removeItem(key) {
        this.localdb.removeItem(key, value);
    }

    clear() {
        this.localdb.clear();
    }
}

export default new LocalDB();
