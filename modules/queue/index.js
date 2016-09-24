'use strict';

const _ = require('lodash');

class Queue {
  constructor(db) {
    this.db = db;
    this.items = [];
    this.listeners = [];
  }

  push(msg) {
    // not a real queue for now...
    return this.dispatch(msg);
  }

  dispatch(msg) {
    _.each(this.listeners, (l) => l(msg));
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }
}

module.exports = Queue;
