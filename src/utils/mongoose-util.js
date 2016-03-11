'use strict';

const mongoose = require('mongoose');
let connected = false;

module.exports.inject = function(LoggerFactory) {
  const logger = LoggerFactory.getCategoryLogger('MongoDB');

  class MongooseUtil {
    static connect(uri, config) {
      return new Promise((resolve, reject) => {
        logger.info('Attempting to connect to MongoDB', { uri });
        mongoose.connect(uri, config, function(err) {
          if (err) {
            logger.error('Could not establish a connection to MongoDB', { err });
            return reject(err);
          }
          connected = true;
          logger.info('Connected to MongoDB', { uri, config });
          resolve(config);
        });
      });
    }

    static disconnect() {
      return new Promise(resolve => {
        if (connected) {
          connected = false;
          mongoose.disconnect(resolve);
        } else {
          resolve();
        }
      });
    }
  }

  return MongooseUtil;
};
