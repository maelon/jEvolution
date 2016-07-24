'use strict';

import AjaxLoader from 'loader/ajaxloader';

class Loader {
    /**
    * @constructor
    * @description
    * @param {Object} config 配置文件
    * @param {Array} config.urls 需要加载的文件url列表
    */
    constructor(config) {
        if(config === undefined) {
            throw new Error('loader need a config');
        }
        if(config['urls'] === undefined || !Array.isArray(config['urls'])) {
            throw new Error('wrong loader urls');
        }
        this._urls = config['urls'];
        this._onload = undefined;
        this._loaders = [];
        this._loadResult = {};
    }

    get onLoad() {
        return this._onload;
    }

    set onLoad(load = () => {}) {
        if(typeof load !== 'function') {
            throw new Error('onload should be function type');
        }
        this._onload = load;
    }

    get loadResult() {
        return this._loadResult;
    }

    start() {
        for(let i = 0; i < this._urls.length; i++) {
            const loader = new AjaxLoader({
                'url': this._urls[i],
                'timeout': 100000
            });
            loader.onSuccess = result => {
                this._loadResult[loader.loadURL] = {
                    'state': 'success',
                    'result': loader.result
                };
                if(this._checkAllLoaded()) {
                    this._callOnLoad();
                }
            };
            loader.onFail = result => {
                this._loadResult[loader.loadURL] = {
                    'state': 'fail',
                    'result': loader.result
                };
                console.log(`load ${ loader.loadURL } error: ${ result }`);
                if(this._checkAllLoaded()) {
                    this._callOnLoad();
                }
            };
            this._loaders.push(loader);
            loader.start();
        }
    }

    _callOnLoad() {
        if(this._onload && typeof this._onload === 'function') {
            for(let i = 0; i < this._loaders.length; i++) {
                this._loadResult['success'] = true;
                for(let s in this._loadResult) {
                    if(this._loadResult[s]['state'] === 'fail') {
                        this._loadResult['success'] = false;
                        break;
                    }
                }
            }
            this._onload(this._loadResult);
        }
    }

    _checkAllLoaded() {
        for(let i = 0; i < this._loaders.length; i++) {
            if(this._loaders[i].loaded === false) {
                return false;
            }
        }
        return true;
    }
}

export default Loader;
