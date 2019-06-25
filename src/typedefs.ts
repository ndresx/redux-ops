import { AnyAction, Action } from 'redux';

export interface Ops<TData = any> {
  readonly [key: string]: Operation<TData>;
}

export interface OpsState<TData = any> extends Ops<TData> {}

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

export type TReducerHandler<S = OpsState, A = AnyAction> = (state: S, action: A) => S;

export type TActionCreator<P = undefined> = AnyAction & {
  readonly payload?: P;
};

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

export interface ClearOperationsAction extends AnyAction {}

export interface OperationActionCreatorFn {
  <TData = any>(id: OpId, status?: OpStatus, data?: TData): OperationAction<TData>;
}

export interface DeleteOperationActionCreatorFn {
  (id: OpId | OpId[]): DeleteOperationAction;
}

export interface ClearOperationsActionCreatorFn {
  (): AnyAction;
}
