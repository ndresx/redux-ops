import {
  OperationStatus,
  CreateOperationAction,
  UpdateOperationAction,
  ClearOperationsAction,
} from './typedefs';
import { CREATE_OP, UPDATE_OP, CLEAR_OPS } from './action_types';
import { buildOperation } from './utils';

export const createOperation = (
  id: string,
  status: OperationStatus = OperationStatus.default,
  data?: any
): CreateOperationAction => ({
  type: CREATE_OP,
  payload: buildOperation(id, status, data),
});

export const updateOperation = (
  id: string,
  status: OperationStatus,
  data?: any
): UpdateOperationAction => ({
  type: UPDATE_OP,
  payload: buildOperation(id, status, data),
});

export const clearOperations = (): ClearOperationsAction => ({
  type: CLEAR_OPS,
});
