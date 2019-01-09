import { OpsState, Ops, Operation } from './typedefs';

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

export function getOps<T, TData, TStatus>(state: T): Ops<TData, TStatus> {
  return state[reducerName];
}

export function getOpById<T, TData, TStatus>(
  state: T,
  id: string
): Operation<TData, TStatus> | undefined {
  return getOps<T, TData, TStatus>(state)[id];
}

export function searchOps<T, TData, TStatus>(state: T, query: RegExp): Operation<TData, TStatus>[] {
  const ops = getOps<T, TData, TStatus>(state);
  return Object.keys(ops)
    .filter(id => !!id.match(query))
    .map(id => ops[id]);
}
