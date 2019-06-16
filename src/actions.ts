import {
  OperationActionCreatorFn,
  DeleteOperationActionCreatorFn,
  ClearOperationsActionCreatorFn,
} from './typedefs';
import { CREATE, UPDATE, DELETE, CLEAR } from './action_types';
import { constructOperation } from './utils';

export const createOperation: OperationActionCreatorFn = (id, status?, data?) => ({
  type: CREATE,
  payload: constructOperation(id, status, data),
});

export const updateOperation: OperationActionCreatorFn = (id, status?, data?) => ({
  type: UPDATE,
  payload: constructOperation(id, status, data),
});

export const deleteOperation: DeleteOperationActionCreatorFn = id => ({
  type: DELETE,
  payload: { id },
});

export const clearOperations: ClearOperationsActionCreatorFn = () => ({
  type: CLEAR,
});
