import { OpsState, Ops, Operation, OpId } from './typedefs';
import * as utils from './utils';

let reducerName = 'ops';

export function setReducerName(name: string): void {
  reducerName = name;
}

export function getOpsState<T>(state: T): OpsState {
  const subState = state[reducerName];

  if (subState === undefined) {
    throw new Error(
      `No reducer found with name ${reducerName}. Try to set it via setReducerName().`
    );
  }

  return subState;
}

export function getOps<T, TData>(state: T): Ops<TData> {
  return getOpsState<T>(state);
}

export function getOpById<T, TData>(state: T, id: OpId): Operation<TData> | undefined {
  return utils.getOpById<TData>(getOps<T, TData>(state), id);
}

export function getOpByIds<T, TData>(state: T, ids: OpId[]): Ops<TData> {
  return utils.getOpByIds<TData>(getOps<T, TData>(state), ids);
}

export function searchOps<T, TData>(state: T, query: string | RegExp): Ops<TData> | undefined {
  return utils.searchOps<TData>(getOps<T, TData>(state), query);
}
