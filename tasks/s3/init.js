var registerTask = require('../../lib/register-task');
var getShipit = require('../../lib/get-shipit');

/**
 * Init task.
 * - Emit s3 event.
 */

module.exports = function (gruntOrShipit) {
  registerTask(gruntOrShipit, 's3:init', task);

  function task() {
    var shipit = getShipit(gruntOrShipit);
    shipit.emit('s3');
  }
};
