'use strict';
const users = {};

module.exports.inject = function(/* User, */ logger) {
  class RouteController {
    static httpGetUser(req, res) {
      const user = users[req.params.id];

      if (!user) {
        return res.status(404).end();
      }

      res.json(user);
    }

    static httpGetAll(req, res) {
      res.json(users);
    }

    static httpDelete(req, res) {
      const id = req.params.id;
      delete users[id];

      logger.info('Deleted user', { id });
      res.statusCode = 204;
      res.end();
    }

    static httpPost(req, res) {
      const user = req.body;
      const id = Math.floor(Math.random() * 10000000);

      users[id] = user;
      const result = { id };

      logger.info('Created user', { id: user });
      res.statusCode = 201;
      res.json(result);
    }
  }

  return RouteController;
};
