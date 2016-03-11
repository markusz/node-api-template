'use strict';

const bodyParser = require('body-parser');
const express = require('express');

const UserRouter = require('../routes/users');

module.exports.inject = function(config, LoggerFactory) {
  const apiLogger = LoggerFactory.getCategoryLogger('API');

  return class ApplicationUtil {
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
      return new Promise(resolve => {
        swaggerConfig.info.version = require('../../package.json').version;
        app.use('/api-docs', (req, res) => res.send(swaggerConfig));

        // http://localhost:3000/docs/?url=/api-docs
        app.use('/docs', express.static(__dirname + '/../../node_modules/swagger-ui/dist/'));
        resolve();
      });
    }
  };
};
