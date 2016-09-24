'use strict';

const _ = require('lodash');
const initialState = require('./bot.initialState');
const { ncall } = require('../../utils');

class BotStorage {
  constructor(db, collection) {
    this.collection = collection;
    this.db = db.collection(collection);
  }

  getUserState(userid) {
    return ncall(this.db, 'findOne', { userid })
      .then(state => state || initialState);
  }

  persistUserState(userid, state) {
    const timestamp = Date.now();
    const document = _.assign({}, state, { userid, timestamp });
    const query = { userid };
    const options = { upsert: true };
    return ncall(this.db, 'update', query, document, options)
      .then(() => state);
  }
}

module.exports = BotStorage;
