import { OpsState, Ops, Operation, OpId } from './typedefs';
import * as utils from './utils';

let reducerName = 'ops';

export function setReducerName(name: string): void {
  reducerName = name;
}

export function getOpsState<T, TStatus, TData>(state: T): OpsState<TStatus, TData> {
  const subState = state[reducerName];

  if (subState === undefined) {
    throw new Error(
      `No reducer found with name ${reducerName}. Try to set it via setReducerName().`
    );
  }

  return subState;
}

export function getOps<T, TStatus, TData>(state: T): Ops<TStatus, TData> {
  return getOpsState<T, TStatus, TData>(state);
}

export function getOpById<T, TStatus, TData>(
  state: T,
  id: OpId
): Operation<TStatus, TData> | undefined {
  return utils.getOpById<TStatus, TData>(getOps<T, TStatus, TData>(state), id);
}

export function getOpByIds<T, TStatus, TData>(state: T, ids: OpId[]): Ops<TStatus, TData> {
  return utils.getOpByIds<TStatus, TData>(getOps<T, TStatus, TData>(state), ids);
}

export function searchOps<T, TStatus, TData>(
  state: T,
  query: string | RegExp
): Ops<TStatus, TData> | undefined {
  return utils.searchOps<TStatus, TData>(getOps<T, TStatus, TData>(state), query);
}
