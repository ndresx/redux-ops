import { AnyAction } from 'redux';
import { Operation } from './typedefs';

export interface Ops {
  readonly [key: string]: Operation;
}

export interface OpsState extends Ops {}

export interface Operation<TData = any, TStatus = OperationStatus> {
  readonly id: string;
  readonly status: TStatus;
  readonly data?: TData;
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
export interface OperationAction<TData = any, TStatus = OperationStatus> extends AnyAction {
  readonly payload: Operation<TData, TStatus>;
}

export interface DeleteOperationAction extends AnyAction {
  readonly payload: {
    readonly id: string;
  };
}

export interface ClearOperationsAction extends AnyAction {}
