'use strict';

const Promise = require('bluebird');
const request = require('request');

module.exports = (token) => {
  const BASE_URL = `https://api.telegram.org/bot${token}`;

  return (method, params = {}) => {
    const url = `${BASE_URL}/${method}`;
    return new Promise((resolve, reject) => {
      request(
        { url,
          json: true,
          method: 'POST',
          body: params,
        },
        (err, res, body) => {
          console.log('body', body)
          if (err) { return reject(err); }
          if (!body.ok) { return reject(body.description); }
          return resolve(body.result);
        }
      );
    });
  };
}
