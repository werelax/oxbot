'use strict';

const _ = require('lodash');
const telegram = require('../telegram/telegram.rpc');
const Bacon = require('baconjs');

const TIMEOUT = 10;

function updatePoll(rpc, sinkValue, sinkError) {
  // TODO: this should be persisted
  let offset = 0;
  const tick = () => (
    rpc('getUpdates', { offset, timeout: TIMEOUT })
      .then((updates) => {
        offset = (_.max(_.map(updates, 'update_id')) + 1) || offset;
        _.each(updates, sinkValue);
        _.delay(tick, 0);
      })
      .catch((err) => {
        // ignore timeouts
        if (err.code !== 'ETIMEDOUT') { sinkError(err); }
        _.delay(tick, 0);
      })
  );
  return tick;
}

function getStream(config) {
  const rpc = telegram(config.telegram.token);
  return Bacon.fromBinder((sink) => {
    const sinkValue = (v) => sink(new Bacon.Next(v));
    const sinkError = (v) => sink(new Bacon.Error(v));
    updatePoll(rpc, sinkValue, sinkError)();
  });
}

module.exports = { getStream };
