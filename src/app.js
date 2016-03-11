'use strict';

/* eslint no-unused-vars: 0 */
const co = require('co');

/* ENV variables */
const MONGO_URL = process.env.REMOTE_MONGO_URL;
const ENVIRONMENT = process.env.NODE_ENV;

const ConfigurationUtil = require('./utils/configuration-util').inject();

/* Configs */
const swaggerConfig = require('../config/api.json');
const serviceConfig = ConfigurationUtil.getConfigForCurrentEnvironment('config/service.json');
const mongoConfig = ConfigurationUtil.getConfigForCurrentEnvironment('config/mongodb.json');
const logConfig = ConfigurationUtil.getConfigForCurrentEnvironment('config/logging.json');

const LoggerFactory = require('./utils/logger-factory').inject(logConfig);

const apiLogger = LoggerFactory.getCategoryLogger('API');
const mongoLogger = LoggerFactory.getCategoryLogger('MongoDB');

const MongooseUtil = require('./utils/mongoose-util').inject(mongoLogger);
const ApplicationUtil = require('./utils/application-util').inject(serviceConfig, LoggerFactory);

const startupSequence = function*() {
  apiLogger.info('Initiating startup sequence in environment %s', ENVIRONMENT);
  const port = process.env.PORT || serviceConfig.port;

  // yield MongooseUtil.connect(mongoConfig.uri, mongoConfig.config, callback, apiLogger);

  const app = ApplicationUtil.makeApp();

  yield ApplicationUtil.attachSwaggerToApp(app, swaggerConfig);
  yield ApplicationUtil.startWebServerOnPort(app, port);
};

co(startupSequence)
  .then(() => apiLogger.info('All systems set up. Service is good to go'))
  .catch(err => apiLogger.error('Fatal error during startup. Server is Shutting down', { err }));
