'use strict';

import Loader from 'loader';

const loader = new Loader({
    'urls': [ 'http://localhost:8000/work/dist/vlist.json' ]
});
loader.onLoad = result => {
    console.log(JSON.parse(result['http://localhost:8000/work/dist/vlist.json']['result']));
};
loader.start();
