const path = require('path');
const link = require('../../runSub/sub/link');
const CONFIG = require('../../../constants/common/CONFIG');

module.exports = function () {
  link(
    path.resolve(__dirname, `../../../${CONFIG.LOCAL_PACKS_BASE}`),
    CONFIG.TYPE_PACKS
  );
};