import { Reducer } from 'redux';

import * as actionTypes from './action_types';
import {
  OpsReducerHandler,
  OpsState,
  OperationAction,
  DeleteOperationAction,
  ResetOperationsAction,
} from './typedefs';

export const defaultState: OpsState = {};

const updateOperation: OpsReducerHandler<OperationAction> = (state, action) => {
  const { payload } = action;
  return { ...state, [payload.id]: { ...payload } };
};

const deleteOperation: OpsReducerHandler<DeleteOperationAction> = (state, action) => {
  const newState = { ...state };
  delete newState[action.payload.id];
  return newState;
};

const resetOperations: OpsReducerHandler<ResetOperationsAction> = () => ({ ...defaultState });

const handlers = {
  [actionTypes.START]: updateOperation,
  [actionTypes.UPDATE]: updateOperation,
  [actionTypes.DELETE]: deleteOperation,
  [actionTypes.RESET]: resetOperations,
};

const reducer: Reducer = (state = defaultState, action: any) => {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
};

export default reducer;
