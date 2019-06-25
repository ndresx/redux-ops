import { Reducer } from 'redux';

import * as actionTypes from './action_types';
import { TReducerHandler, OpsState, OpId } from './typedefs';

export const defaultState: OpsState = {};

const updateOperation: TReducerHandler = (state, action) => {
  const { payload } = action;
  return { ...state, [payload.id]: { ...payload } };
};

const deleteOperation: TReducerHandler = (state, { payload }) => {
  const newState = { ...state };
  const opIds = Array.isArray(payload.id) ? payload.id : [payload.id];
  opIds.forEach((opId: OpId) => delete newState[opId]);
  return newState;
};

const clearOperations: TReducerHandler = () => ({ ...defaultState });

const handlers = {
  [actionTypes.START]: updateOperation,
  [actionTypes.UPDATE]: updateOperation,
  [actionTypes.DELETE]: deleteOperation,
  [actionTypes.CLEAR]: clearOperations,
};

const reducer: Reducer = (state = defaultState, action) => {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
};

export default reducer;
