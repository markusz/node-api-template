'use strict';

const directory = __dirname + '/../../config';
const config = require('yaml-config-lib')([
  directory + '/all.yml',
  directory + '/' + (process.env.NODE_ENV || 'test') + '.yml',
  directory + '/local.yml'
]);

const lodash = require('lodash');
const winston = require('winston');
const LogUtil = require('logger-factory').inject(config.logging, winston);

const async = require('async');
const mongooseWrapper = require('../utils/mongoose-util').inject(winston);

const express = require('express');
const expressUtil = require('routing-util');

const NO_LOG_TRANSPORTS = [];
const logger = new (winston.Logger)({
  transports: NO_LOG_TRANSPORTS
});

const REMOTE_MONGO_URL = process.env.REMOTE_MONGO_URL;

module.exports.inject = function() {
  class TestUtil {
    static getApp() {
      return expressUtil.inject(config, express, LogUtil);
    }

    static envDependentSetup(useApp, useDB, done) {
      const dbInit = function(cb) {
        const next = function() {
          cb(null);
        };

        if (!REMOTE_MONGO_URL) {
          throw new Error('ENV-variable REMOTE_MONGO_URL missing');
        }
        mongooseWrapper.connect(REMOTE_MONGO_URL, {}, next, logger);
      };

      const setUpSequence = [];

      if (useDB) {
        setUpSequence.push(dbInit);
      }

      async.series(setUpSequence, function(err, results) {
        // async.series unfortunately puts the results into an array that we have to filter once received.
        // async.waterfall can not be used here since it relies on signatures that are known in advance, which we can not provide since setUpSequence is dynamically created
        const appConfig = lodash.result(lodash.find(results, function(result) {
          return !!result && !!result.appConfig;
        }), 'appConfig');

        done(err, appConfig);
      });
    }

    static envDependentTearDown(server, done) {
      mongooseWrapper.disconnect(done);
    }
  }

  return TestUtil;
};
