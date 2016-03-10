'use strict';

module.exports.inject = function(logger) {
  return function(req, res, next) {
    const userToken = req.headers.usertoken;

    if (!userToken) {
      logger.warn('headers.usertoken is required, but has been missing');
      return res.status(400).end();
    }

    if (userToken !== '42') {
      logger.warn('only user with usertoken 42 is allowed to use this route');
      return res.status(401).end();
    }

    next();
  };
};
