import {
  OperationStatus,
  DeleteOperationAction,
  ClearOperationsAction,
  OperationAction,
} from './typedefs';
import { CREATE, UPDATE, DELETE, CLEAR } from './action_types';
import { buildOperation } from './utils';

interface OperationActionCreator {
  <TData = any, TStatus = OperationStatus>(
    id: string,
    status?: TStatus,
    data?: TData
  ): OperationAction<TData, TStatus | OperationStatus>;
}

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
