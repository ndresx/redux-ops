import {
  OperationActionCreatorFn,
  DeleteOperationActionCreatorFn,
  ClearOperationsActionCreatorFn,
} from './typedefs';
import { START, UPDATE, DELETE, CLEAR } from './action_types';
import { createOperation } from './utils';

export const startOperation: OperationActionCreatorFn = (id, status, data?) => ({
  type: START,
  payload: createOperation(id, status, data),
});

export const updateOperation: OperationActionCreatorFn = (id, status, data?) => ({
  type: UPDATE,
  payload: createOperation(id, status, data),
});

export const deleteOperation: DeleteOperationActionCreatorFn = id => ({
  type: DELETE,
  payload: { id },
});

export const clearOperations: ClearOperationsActionCreatorFn = () => ({
  type: CLEAR,
});
