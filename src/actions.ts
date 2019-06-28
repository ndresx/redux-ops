import {
  OperationActionCreator,
  DeleteOperationActionCreator,
  ResetOperationsActionCreator,
} from './typedefs';
import { START, UPDATE, DELETE, RESET } from './action_types';
import { createOperation } from './utils';

export const startOperation: OperationActionCreator = (id, status?, data?) => ({
  type: START,
  payload: createOperation(id, status, data),
});

export const updateOperation: OperationActionCreator = (id, status, data?) => ({
  type: UPDATE,
  payload: createOperation(id, status, data),
});

export const deleteOperation: DeleteOperationActionCreator = id => ({
  type: DELETE,
  payload: { id },
});

export const resetOperations: ResetOperationsActionCreator = () => ({
  type: RESET,
});
