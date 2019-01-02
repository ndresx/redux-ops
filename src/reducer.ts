import { AnyAction } from 'redux';

import { OpsState, ActionHandler } from './typedefs';
import * as actionTypes from './action_types';

export const defaultState: OpsState = {};

const createOperation: ActionHandler = (state, action) => {
  const {
    payload: { id },
  } = action;

  if (state[id]) {
    console.error(`ERROR: Cannot create new operation. Operation with id "${id}" already exists.`);
    return state;
  }

  return { ...state, [id]: { ...action.payload } };
};

const updateOperation: ActionHandler = (state, action) => {
  const {
    payload: { id },
  } = action;

  if (!state[id]) {
    console.error(`ERROR: Cannot update operation. Operation with ${id} doesn't exist.`);
    return state;
  }

  return { ...state, [id]: { ...action.payload } };
};

const clearOperations: ActionHandler = (state, action) => ({ ...defaultState });

const handlers = {
  [actionTypes.CREATE_OP]: createOperation,
  [actionTypes.UPDATE_OP]: updateOperation,
  [actionTypes.CLEAR_OPS]: clearOperations,
};

export default function reducer(state: OpsState = defaultState, action: AnyAction): OpsState {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
}
