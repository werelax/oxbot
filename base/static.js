'use strict';

module.exports = (server) => {
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
      },
    },
  });
};
