import { AnyAction, Action } from 'redux';

export interface Ops<TStatus = OpStatus, TData = any> {
  readonly [key: string]: Operation<TStatus, TData>;
}

export interface OpsState<TStatus = OpStatus, TData = any> extends Ops<TStatus, TData> {}

export interface Operation<TStatus = OpStatus, TData = any> {
  readonly id: OpId;
  readonly status?: TStatus;
  readonly data?: TData;
}

export type OpId = number | string;

export enum OpStatus {
  Default = 'default',
  Loading = 'loading',
  Intermediate = 'intermediate',
  Success = 'success',
  Error = 'error',
}

export type TReducerHandler<S = OpsState, A = AnyAction> = (state: S, action: A) => S;

export type TActionCreator<P = undefined> = AnyAction & {
  readonly payload?: P;
};

export type OperationActionHandler = (state: OpsState, action: OperationAction) => OpsState;

// Actions
export interface OperationAction<TStatus = OpStatus, TData = any> extends Action {
  readonly payload: Operation<TStatus, TData>;
}

export interface DeleteOperationAction extends AnyAction {
  readonly payload: {
    readonly id: OpId | OpId[];
  };
}

export interface ClearOperationsAction extends AnyAction {}

export interface OperationActionCreatorFn {
  <TStatus = OpStatus, TData = any>(id: OpId, status?: TStatus, data?: TData): OperationAction<
    TStatus,
    TData
  >;
}

export interface DeleteOperationActionCreatorFn {
  (id: OpId | OpId[]): DeleteOperationAction;
}

export interface ClearOperationsActionCreatorFn {
  (): AnyAction;
}
