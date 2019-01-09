import { DeleteOperationAction, ClearOperationsAction, OperationActionCreator } from './typedefs';
import { CREATE, UPDATE, DELETE, CLEAR } from './action_types';
import { buildOperation } from './utils';

export const createOperation: OperationActionCreator = (id, status?, data?) => ({
  type: CREATE,
  payload: buildOperation(id, status, data),
});

export const updateOperation: OperationActionCreator = (id, status?, data?) => ({
  type: UPDATE,
  payload: buildOperation(id, status, data),
});

export const deleteOperation = (id: string): DeleteOperationAction => ({
  type: DELETE,
  payload: { id },
});

export const clearOperations = (): ClearOperationsAction => ({
  type: CLEAR,
});
