import { Reducer } from 'redux';

import * as actionTypes from './action_types';
import { OpReducerHandler, OpsState, OpId } from './typedefs';

export const defaultState: OpsState = {};

const updateOperation: OpReducerHandler = (state, action) => {
  const { payload } = action;
  return { ...state, [payload.id]: { ...payload } };
};

const deleteOperation: OpReducerHandler = (state, { payload }) => {
  const newState = { ...state };
  const opIds = Array.isArray(payload.id) ? payload.id : [payload.id];
  opIds.forEach((opId: OpId) => delete newState[opId]);
  return newState;
};

const resetOperations: OpReducerHandler = () => ({ ...defaultState });

const handlers = {
  [actionTypes.START]: updateOperation,
  [actionTypes.UPDATE]: updateOperation,
  [actionTypes.DELETE]: deleteOperation,
  [actionTypes.RESET]: resetOperations,
};

const reducer: Reducer = (state = defaultState, action) => {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
};

export default reducer;
