'use strict';

const _ = require('lodash');

function dispatchMessage(queue, db, message) {
  const userid = _.get(message, 'from.id');
  queue.push({
    type: 'BOT_MESSAGE_RECEIVED',
    userid,
    payload: message,
  });
}

function dispatchCallback(queue, db, callback) {
  const userid = _.get(callback, 'from.id');
  const payload = callback.data;
  queue.push({
    type: 'BOT_POSTBACK_RECEIVED',
    userid,
    payload: _.assign({}, callback, {
      postback: { payload },
    }),
  });
}

function dispatchEvent(db, queue) {
  return (event) => {
    switch (true) {
      case _.has(event, 'message'):
        return dispatchMessage(queue, db, event.message);
      case _.has(event, 'callback_query'):
        return dispatchCallback(queue, db, event.callback_query);
      case _.has(event, 'inline_query'):
      case _.has(event, 'chosen_inline_result'):
      case _.has(event, 'edited_message'):
      default:
        return console.warn('[TelegramService] Uknown Event Type', event);
    }
  };
}

function dispatchError(error) {
  console.error('[TelegramService] Error:', error);
}

module.exports = { dispatchEvent, dispatchError };
