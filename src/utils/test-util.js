'use strict';

const SilentLoggerFactory = require('../utils/logger-factory').silent();
const ConfigurationUtil = require('../utils/configuration-util').inject();
const ApplicationUtil = require('../utils/application-util');

const serviceConfig = ConfigurationUtil.getConfigForCurrentEnvironment('config/service.json');


module.exports.inject = function() {
  class TestUtil {
    static getApp() {
      return ApplicationUtil.inject(serviceConfig, SilentLoggerFactory).makeApp();
    }
  }

  return TestUtil;
};
