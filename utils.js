'use strict';

const Promise = require('bluebird');

exports.ncall = (obj, method, ...args) =>
  Promise.fromNode((f) => obj[method](...args, f));
