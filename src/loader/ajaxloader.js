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
           config.['url'] === '' ||
           !(/.(html|js|js\.map|css|json)$/i).test(config['url'])
          ) {
            throw new Error('Invalid ajax url');
        }
        this._url = config['url'];
        this._timeout = config['timeout'];
        this._success = undefined;
        this._fail = undefined;
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
}

export default AjaxLoader;
