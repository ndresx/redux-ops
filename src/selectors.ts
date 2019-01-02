import { OpsState, Ops, Operation, OperationStatus } from './typedefs';

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

export function getOps<T>(state: T): Ops {
  return getOpsState(state);
}

export function getOpById<T, TData, TStatus>(
  state: T,
  id: string
): Operation<TData, TStatus | OperationStatus> | undefined {
  return getOps(state)[id];
}

export function searchOps<T, TData, TStatus>(
  state: T,
  query: RegExp
): Operation<TData, TStatus | OperationStatus>[] {
  const ops = getOps(state);
  return Object.keys(ops)
    .filter(id => !!id.match(query))
    .map(id => ops[id]);
}
