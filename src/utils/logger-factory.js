'use strict';

const winston = require('winston');

module.exports.inject = function(config) {
  return class {
    static getCategoryLogger(category) {
      const logger = new (winston.Logger)();
      if (config && config.transports) {
        for (const transport of config.transports) {
          transport.options.label = category;
          logger.add(winston.transports[transport.type], transport.options);
        }
      }
      return logger;
    }
  };
};


module.exports.silent = function() {
  return class {
    static getCategoryLogger() {
      return new (winston.Logger)();
    }
  };
};
