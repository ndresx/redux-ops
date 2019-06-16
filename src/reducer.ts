import { Reducer } from 'redux';

import * as actionTypes from './action_types';
import { TReducerHandler, OpsState } from './typedefs';

export const defaultState: OpsState = {};

const createOperation: TReducerHandler = (state, action) => {
  const {
    payload: { id },
  } = action;

  if (state[id]) {
    console.error(`Warning: Cannot create new operation "${id}" because it already exists.`);
    return state;
  }

  return { ...state, [id]: { ...action.payload } };
};

const updateOperation: TReducerHandler = (state, action) => {
  const {
    payload: { id },
  } = action;

  if (!state[id]) {
    console.error(`Warning: Cannot update operation "${id}" because it doesn't exist.`);
    return state;
  }

  return { ...state, [id]: { ...action.payload } };
};

const deleteOperation: TReducerHandler = (state, { payload }) => {
  const newState = { ...state };
  const opIds = Array.isArray(payload.id) ? payload.id : [payload.id];
  opIds.forEach(opId => delete newState[opId]);
  return newState;
};

const clearOperations: TReducerHandler = () => ({ ...defaultState });

const handlers = {
  [actionTypes.CREATE]: createOperation,
  [actionTypes.UPDATE]: updateOperation,
  [actionTypes.DELETE]: deleteOperation,
  [actionTypes.CLEAR]: clearOperations,
};

const reducer: Reducer = (state = defaultState, action) => {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
};

export default reducer;
