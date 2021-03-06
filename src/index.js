'use strict';

import mounter from 'mounter';
import Updater from 'updater';
import updatePolocy from 'updater/updatepolicy';

const matchPageName = window.location.pathname.match(/\/(\w+)\.html$/);
if(matchPageName && matchPageName.length > 1) {
    const success = mounter.mountPage(document, matchPageName[1]);
    if(success) {
    } else {
        console.log('mount page failed');
        //跳转到指定页面
        //window.location.href = '';
    }

    const updater = new Updater(matchPageName[1], 'http://localhost:8000/work/dist/vlist.json', updatePolocy);
    updater.update();
} else {
    console.log('there is no page name');
}
