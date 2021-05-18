const path = require('path');
const list = require('../../runSub/sub/list');
const CONFIG = require('../../../constants/common/CONFIG');

module.exports = function () {
  list(
    path.resolve(__dirname, `../../../${CONFIG.LOCAL_PACKS_BASE}`),
    CONFIG.TYPE_PACKS
  );
}
