'use strict';

const mongoose = require('mongoose');
let connected = false;

module.exports.inject = function create(logger) {
  class MongooseUtil {
    static connect(uri, config) {
      return new Promise((resolve, reject) => {
        logger.info('Attempting to connect to MongoDB at %s', uri);
        mongoose.connect(uri, config, function(err) {
          if (err) {
            logger.error('Could not establish a connection to MongoDB', { error: err });
            return reject(err);
          }
          connected = true;
          logger.info('Connected to MongoDB in env [%s] with URL: %s and Config %s', process.env.NODE_ENV, uri, JSON.stringify(config));
          resolve(config);
        });
      })
    }

    static disconnect() {
      return new Promise((resolve, reject) => {
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
