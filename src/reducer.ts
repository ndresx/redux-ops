import { Reducer } from 'redux';

import * as actionTypes from './action_types';
import {
  OpReducerHandler,
  OpsState,
  OperationAction,
  DeleteOperationAction,
  ResetOperationsAction,
} from './typedefs';

export const defaultState: OpsState = {};

const updateOperation: OpReducerHandler<OperationAction> = (state, action) => {
  const { payload } = action;
  return { ...state, [payload.id]: { ...payload } };
};

const deleteOperation: OpReducerHandler<DeleteOperationAction> = (state, action) => {
  const newState = { ...state };
  delete newState[action.payload.id];
  return newState;
};

const resetOperations: OpReducerHandler<ResetOperationsAction> = () => ({ ...defaultState });

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
