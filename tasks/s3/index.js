var registerTask = require('../../lib/register-task');

/**
 * s3 task.
 * - s3:init
 * - s3:upload
 */

module.exports = function (gruntOrShipit) {
  require('./init')(gruntOrShipit);
  require('./upload')(gruntOrShipit);

  registerTask(gruntOrShipit, 's3', [
    's3:init',
    's3:upload'
  ]);
};
