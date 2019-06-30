import { AnyAction, Action } from 'redux';

export interface Operation<TData = any> {
  readonly id: OpId;
  readonly status: OpStatus;
  readonly data?: TData;
}

export type OpId = number | string;

export enum OpStatus {
  Started = 'started',
  Success = 'success',
  Error = 'error',
}

// State
export interface Ops<TData = any> {
  readonly [key: string]: Operation<TData>;
}

export interface OpsState extends Ops {}

export type OpsReducerHandler<A extends AnyAction = AnyAction> = (
  state: OpsState,
  action: A
) => OpsState;

export type OperationActionHandler = (state: OpsState, action: OperationAction) => OpsState;

// Actions
export interface OperationAction<TData = any> extends Action {
  readonly payload: Operation<TData>;
}

export interface DeleteOperationAction extends AnyAction {
  readonly payload: {
    readonly id: OpId;
  };
}

export interface ResetOperationsAction extends AnyAction {}

export interface OperationActionCreator {
  <TData = any>(id: OpId, status?: OpStatus, data?: TData): OperationAction<TData>;
}

export interface DeleteOperationActionCreator {
  (id: OpId): DeleteOperationAction;
}

export interface ResetOperationsActionCreator {
  (): AnyAction;
}
