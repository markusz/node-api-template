'use strict';
/* jshint -W098 */

module.exports.inject = function(superagent) {
  class GoogleProxy {
    static isGoogleOnline(cb) {
      superagent.get('www.google.de').end(function(err, res) {
        const isOffline = err || res.statusCode >= 300;
        cb(!isOffline);
      });
    }
  }

  return GoogleProxy;
};
