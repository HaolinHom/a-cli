const path = require('path');
const unlink = require('../../runSub/sub/unlink');
const CONFIG = require('../../../constants/common/CONFIG');

module.exports = function () {
  unlink(
    path.resolve(__dirname, `../../../${CONFIG.LOCAL_PACKS_BASE}`),
    CONFIG.TYPE_PACKS
  );
}

