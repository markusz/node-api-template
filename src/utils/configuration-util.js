'use strict';

/* istanbul ignore next */

const ENVIRONMENT = process.env.NODE_ENV || 'development';
const lodash = require('lodash');
const appRootDir = require('app-root-dir').get();

module.exports.inject = logger => {
  return class ConfigurationUtil {
    static getConfigForCurrentEnvironment(configPath) {
      const configFullPath = appRootDir + '/' + configPath;
      const rawConfig = require(configFullPath);

      const generalConfig = rawConfig['*'];
      const environmentConfig = rawConfig[ENVIRONMENT];

      const mergedConfig = lodash.merge({}, generalConfig, environmentConfig);

      if (logger) {
        logger.info('CONFIG="%s" for ENV=%s', configPath, ENVIRONMENT, { config: mergedConfig });
      }

      return mergedConfig;
    }
  };
};
