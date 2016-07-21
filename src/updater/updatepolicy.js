'use strict';

const updatePolicy = {
    shouldUpdateByTime(lasttimestamp) {
        const now = new Date();
        if(+now > lasttimestamp) {
            if(now.getHours() !== (new Date(lasttimestamp)).getHours()) {
                return true;
            }
        }
        return false;
    }
};

export default updatePolicy;
