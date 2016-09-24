'use strict';

const _ = require('lodash');
const telegramEventStream = require('./t_e.eventstream');
const telegramEventService = require('./t_e.service');

module.exports = (db, queue, config) => {
  const stream = telegramEventStream.getStream(config);
  stream.onValue(telegramEventService.dispatchEvent(db, queue));
  stream.onError(telegramEventService.dispatchError);
};
