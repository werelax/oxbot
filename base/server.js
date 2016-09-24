'use strict';

const Hapi = require('hapi');
const inert = require('inert');
const Promise = require('bluebird');

module.exports = (config) => {
  const server = new Hapi.Server({
    connections: {
      routes: {
        files: {
          relativeTo: `${__dirname}/../../../static/`,
        },
      },
    },
  });
  server.connection({ port: config.port });
  return Promise
    .fromNode(f => server.register(inert, f))
    .then(() => server);
};
