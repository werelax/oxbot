'use strict';

const _ = require('lodash');
const BotStorage = require('./bot.storage');
const botRedux = require('./bot.redux');
const reducer = require('./bot.reducer');

module.exports = (config, db, queue, tree) => {
  const collection = _.get(config, 'db.collection');
  const storage = new BotStorage(db, collection);
  queue.subscribe(action => (
    botRedux.handleAction(storage, queue, reducer, action, tree, db)
  ));
};
