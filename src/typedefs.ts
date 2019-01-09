import { AnyAction } from 'redux';
import { Operation } from './typedefs';

export interface Ops<TData = any, TStatus = OperationStatus> {
  readonly [key: string]: Operation<TData, TStatus>;
}

export interface OpsState extends Ops {}

export interface Operation<TData = any, TStatus = OperationStatus> {
  readonly id: string;
  readonly status: TStatus | OperationStatus;
  readonly data?: TData;
}

export const enum OperationStatus {
  Default = 'default',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
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

export interface OperationActionCreator {
  <TData = any, TStatus = OperationStatus>(
    id: string,
    status?: TStatus,
    data?: TData
  ): OperationAction<TData, TStatus | OperationStatus>;
}
