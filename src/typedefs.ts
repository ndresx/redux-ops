import { AnyAction, Action } from 'redux';

export interface Operation<TData = any> {
  readonly id: OpId;
  readonly status: OpStatus;
  readonly data?: TData;
}

export type OpId = number | string;

export enum OpStatus {
  Started = 'started',
  Intermediate = 'intermediate',
  Success = 'success',
  Error = 'error',
}

// State
export interface Ops<TData = any> {
  readonly [key: string]: Operation<TData>;
}

export interface OpsState extends Ops {}

export type OpReducerHandler<S = OpsState, A = AnyAction> = (state: S, action: A) => S;

export type OperationActionHandler = (state: OpsState, action: OperationAction) => OpsState;

// Actions
export interface OperationAction<TData = any> extends Action {
  readonly payload: Operation<TData>;
}

export interface DeleteOperationAction extends AnyAction {
  readonly payload: {
    readonly id: OpId | OpId[];
  };
}

export interface ResetOperationsAction extends AnyAction {}

export interface OperationActionCreator {
  <TData = any>(id: OpId, status?: OpStatus, data?: TData): OperationAction<TData>;
}

export interface DeleteOperationActionCreator {
  (id: OpId | OpId[]): DeleteOperationAction;
}

export interface ResetOperationsActionCreator {
  (): AnyAction;
}
