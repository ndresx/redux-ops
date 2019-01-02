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

export function getOps<T>(state: T): Ops {
  return getOpsState(state);
}

export function getOpById<T>(state: T, id: string): Operation | undefined {
  return getOps(state)[id];
}

export function searchOps<T>(state: T, query: RegExp): Operation[] {
  const ops = getOps(state);
  return Object.keys(ops)
    .filter(id => !!id.match(query))
    .map(id => ops[id]);
}
