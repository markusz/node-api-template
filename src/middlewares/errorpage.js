'use strict';

module.exports.inject = function(logger) {
  /* istanbul ignore next */

  return function(req, res) {
    if (req.user) {
      logger.warn('User %s (%s) requested path ' + req.baseUrl + ' which is not available', req.user.username, req.user.email);
    } else {
      logger.warn('An anonymous user requested path ' + req.baseUrl + ' which is not available');
    }

    res.statusCode = 404;
    res.end();
  };
};
