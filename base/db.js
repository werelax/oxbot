'use strict';

const mongo = require('mongoskin');

module.exports = (config) => {
  const MONGO_URL = `mongodb://${config.host}:${config.port}/${config.database}`;
  return mongo.db(MONGO_URL, { native_parser: true });
};
