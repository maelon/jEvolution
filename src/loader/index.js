'use strict';

class Loader {
    /**
    * @constructor
    * @description
    * @param {Object} config 配置文件
    * @param {Array} config.urls 需要加载的文件url列表
    * @param {Function} config.onload 加载完成后的回调
    */
    constructor(config) {
        this._urls = config['urls'];
        this._onload = undefined;
    }

    get onLoad() {
        return this._onload;
    }

    set onLoad(load = () => {}) {
        this._onload = load;
    }

    start() {
    }
}

export default Loader;
