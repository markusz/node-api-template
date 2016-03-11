'use strict';

module.exports.inject = function(LogUtil) {
  const userLogger = LogUtil.getCategoryLogger('/users');
  // const UserModel = require('../models/user')(lodash);

  const UserController = require('./users/v1/index').inject(/* UserModel, */ userLogger);

  /* eslint new-cap: 0 */
  const AuthMiddleware = require('../middlewares/auth').inject(userLogger);
  const userRouter = require('express').Router();

  userRouter.use(AuthMiddleware);

  /* Versioning */
  userRouter.get('/v1', UserController.httpGetAll);
  userRouter.post('/v1', UserController.httpPost);
  userRouter.get('/v1/:id', UserController.httpGetUser);
  userRouter.delete('/v1/:id', UserController.httpDelete);

  return userRouter;
};
