import { AnyAction } from 'redux';
import { Operation } from './typedefs';

export interface Ops {
  [key: string]: Operation;
}

export interface OpsState extends Ops {}

export interface Operation {
  id: string;
  status: OperationStatus;
  data: any;
}

export const enum OperationStatus {
  default = 'default',
  loading = 'loading',
  success = 'success',
  error = 'error',
}

export type ActionHandler = (state: OpsState, action: AnyAction) => OpsState;

export type OperationActionHandler = (state: OpsState, action: OperationAction) => OpsState;

// Actions
export interface OperationAction extends AnyAction {
  payload: Operation;
}

export interface CreateOperationAction extends OperationAction {}

export interface UpdateOperationAction extends OperationAction {}

export interface ClearOperationsAction extends AnyAction {}
