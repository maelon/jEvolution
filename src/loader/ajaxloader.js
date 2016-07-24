'use strict';

/**
* 通过ajax加载远程html js css json文件
*/
class AjaxLoader {
    /**
    * @constructor
    * @description
    * @param {Object} config 配置文件
    * @param {String} config.url 文件url
    * @param {Number} config.timeout 超时时间
    */
    constructor(config) {
        if(config['url'] === undefined ||
           typeof config['url'] !== 'string' ||
           config['url'] === '' ||
           !(/.(html|js|js\.map|css|json)$/i).test(this._parseURL(config['url']).pathname)
          ) {
            throw new Error('Invalid ajax url');
        }
        this._url = config['url'];
        this._timeout = config['timeout'];
        this._success = undefined;
        this._fail = undefined;
        this._loaded = false;
        this._result = null;
    }

    get loadURL() {
        return this._url;
    }

    get onSuccess() {
        return this._success;
    }

    set onSuccess(success = () => {}) {
        this._success = success;
    }

    get onFail() {
        return this._onFail;
    }

    set onFail(fail = () => {}) {
        this._fail = fail;
    }

    get loaded() {
        return this._loaded;
    }

    get result() {
        return this._result;
    }

    start() {
        let xhr;
        if(window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            throw new Error('unsupport XMLHttpRequest');
        }

        if(xhr) {
            xhr.responseType = 'text';
            xhr.timeout = this._timeout || 0;
            xhr.onreadystatechange = e => {
                if(xhr.readyState === 4) {
                    this._loaded = true;
                    this._result = xhr.responseText;
                    if(xhr.status === 200) {
                        this._success && typeof this._success === 'function' && this._success(xhr.responseText);
                    } else {
                        this._fail && typeof this._fail === 'function' && this._fail(xhr.responseText);
                    }
                }
            }
            xhr.open('GET', this._url, true);
            xhr.send();
        }
    }

    _parseURL(url) {
        const a = document.createElement('a');
        a.setAttribute('href', url);
        return {
            'href': url,
            'protocol': a.protocol,
            'host': a.host,
            'hostname': a.hostname,
            'port': a.port,
            'search': a.search,
            'hash': a.hash,
            'pathname': a.pathname
        };
    }
}

export default AjaxLoader;
