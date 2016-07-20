'use strict';

import store from 'store';

class Mounter {
    constructor() {
    }

    mountPage(doc, pagename) {
        const pageContent = store.getPageStorage(pagename);
        if(pageContent) {
            let htmlStr = this._replaceLocalResource(pageContent); 
            const htmlAttrs = this._getHTMLAttributes(htmlStr);
            for(let s in htmlAttrs) {
                doc.documentElement.setAttribute(s, htmlAttrs[s]);
            }
            const html = this._createHTMLDomTemplate(htmlStr);
            doc.documentElement.replaceChild(html.head, doc.head);
            doc.documentElement.replaceChild(html.body, doc.body);
            return true;
        }
        return false;
    }

    _replaceLocalResource(pageContent) {
        let htmlStr = pageContent['html'];
        for(let cssurl in pageContent['css']) {
            const linkExpReg = new RegExp('<link[^<,>]*href\s*=\s*[\"\']' + cssurl + '[\"\'][^<,>]*\/?>', 'i');
            htmlStr = htmlStr.replace(linkExpReg, '<style type="text/css">' + pageContent['css'][cssurl] + '</style>');
        }
        for(let jsurl in pageContent['js']) {
            const jsExpReg = new RegExp('<script[^<,>]*src\s*=\s*[\"\']' + jsurl + '[\"\'][^<,>]*></script>', 'i');
            htmlStr = htmlStr.replace(jsExpReg, '<script type="text/javascript">' + pageContent['js'][jsurl] + '</script>');
        }
        return htmlStr;
    }

    _createHTMLDomTemplate(htmlstr) {
        const html = document.createElement('html');
        html.innerHTML = htmlstr.match(/^<html[^<,>]*>([\s\S]*)?<\/html>/i)[1];
        return html;
    }

    _getHTMLAttributes(htmlstr) {
        const matchs = htmlstr.(/^<html\s*([^<,>]*)?>/i);
        if(matchs) {
            const attrs = {};
            const attrE = matchs[1].split(/\s+/);
            for(let i = 0; i < attrE.length; i++) {
                const ats = attrE.split('=');
                attrs[ats[0]] = ats[1];
            }
            return attrs;
        }
        return null;
    }
}

export default new Mounter();
