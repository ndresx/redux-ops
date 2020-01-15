import {
  OperationActionCreator,
  DeleteOperationActionCreator,
  ResetOperationsActionCreator,
  OpStatus,
  OpId,
  OperationAction,
} from './typedefs';
import { START, UPDATE, DELETE, RESET } from './action_types';
import { createOperation } from './utils';

export const startOperation = <TData = any>(id: OpId, data?: TData): OperationAction<TData> => ({
  type: START,
  payload: createOperation(id, OpStatus.Start, data),
});

export const updateOperation: OperationActionCreator = (id, status, data?) => ({
  type: UPDATE,
  payload: createOperation(id, status, data),
});

export const deleteOperation: DeleteOperationActionCreator = id => ({
  type: DELETE,
  payload: createOperation(id, OpStatus.Delete),
});

export const resetOperations: ResetOperationsActionCreator = () => ({
  type: RESET,
});
