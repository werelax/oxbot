'use strict';

const _ = require('lodash');

class MessagingService {
  constructor(queue) {
    this.queue = queue;
  }

  dispatch(id, time, payload) {
    const sender = _.get(payload, 'sender.id');
    if (_.has(payload, 'message') &&
        !_.has(payload, 'message.is_echo')) {
      this.dispatchMessage(id, time, sender, payload);
    } else if (_.has(payload, 'postback')) {
      this.dispatchPostback(id, time, sender, payload);
    }
    // WARNING: we're ignore the rest of the messages for now...
  }

  dispatchMessage(id, time, userid, payload) {
    const action = {
      type: 'BOT_MESSAGE_RECEIVED',
      userid,
      payload: _.assign({}, payload, {
        meta: { id, time },
      }),
    };
    this.queue.push(action);
  }

  dispatchPostback(id, time, userid, payload) {
    const action = {
      type: 'BOT_POSTBACK_RECEIVED',
      userid,
      payload: _.assign({}, payload, {
        meta: { id, time },
      }),
    };
    this.queue.push(action);
  }
}

module.exports = MessagingService;
