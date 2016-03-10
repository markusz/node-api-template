'use strict';

const swaggerMiddleware = require('../../../vendor/swagger-express-middleware');
const express = require('express');

/**
 * Middleware to provide the /swagger and /api-doc routes
 */
module.exports.attach = function(app, errorPageMiddleware, config, logger) {
  if (config) {
    const apiDocRef = config.apiDocReference;
    const apiDocRefFolder = apiDocRef.substring(0, apiDocRef.lastIndexOf('/'));
    const apiDoc = require(process.cwd() + apiDocRef);

    swaggerMiddleware(apiDoc, app, function(error, middleware) {
      if (error) {
        return logger.warn('Swagger middleware instantiation failed');
      }

      app.use('/api-doc', express.static('.' + apiDocRefFolder));
      app.use('/swagger', express.static('./vendor/swagger-ui/'));
      app.use('*', errorPageMiddleware);
      app.use(
        middleware.metadata(),
        middleware.files(),
        middleware.parseRequest(),
        middleware.validateRequest(),
        middleware.mock()
      );
    });
  }
};
