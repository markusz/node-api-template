'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const JSONRefParser = require('json-schema-ref-parser');
const SwaggerTools = require('swagger-tools');

const UserRouter = require('../routes/users');

module.exports.inject = function(config, LoggerFactory) {
  return class RoutingUtil {
    static makeApp() {
      const app = express();

      app.use(bodyParser.json());

      app.use('/ping', function(req, res) {
        res.end();
      });

      // Initialize routers
      app.use('/users', UserRouter.inject(LoggerFactory));

      return app;
    }

    static startWebServerOnPort(_app, port) {
      return new Promise(resolve => {
        apiLogger.info('Attempting to start Service on Port %s', port);
        _app.listen(port, function() {
          const serverAddress = this.address();
          apiLogger.info('Service listening at http://%s:%s', serverAddress.address, serverAddress.port);
          resolve(serverAddress);
        });
      });
    }

    static attachSwaggerToApp(app, swaggerConfig) {
      return new Promise((resolve, reject) => {
        JSONRefParser.dereference(swaggerConfig, function(err, schema) {
          if (err) {
            console.log('err:',err);
            return reject(err);
          }

          schema.info.version = require('../../package.json').version;
          SwaggerTools.initializeMiddleware(swaggerConfig, function(middleware) {
            app.use(middleware.swaggerUi());
            resolve();
          });
        });
      });
    }
  }
};
