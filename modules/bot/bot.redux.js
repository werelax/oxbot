'use strict';

const _ = require('lodash');

const simpleApplyRootReducer = (state, action, dispatch, reducer, tree, db) =>
      reducer(state, action, dispatch, tree(), db);

exports.handleAction = (storage, queue, reducer, action, tree, db) => {
  const { userid } = action;
  const dispatch = _action => queue.push(_.assign({}, _action, { userid }));
  return storage
    .getUserState(userid)
    .then(state =>
          simpleApplyRootReducer(state, action, dispatch, reducer, tree, db))
    .then(newState => storage.persistUserState(userid, newState));
};
