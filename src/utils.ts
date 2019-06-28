import { Operation, OpStatus, Ops, OpId } from './typedefs';

export function createOperation<TData = any>(
  id: OpId,
  status: OpStatus = OpStatus.Started,
  data?: TData
): Operation<TData> {
  return { id, status, data };
}

export function getOpById<TData = any>(ops: Ops<TData>, id: OpId): Operation<TData> | undefined {
  return ops[id];
}

export function getOpByIds<TData = any>(ops: Ops<TData>, ids: OpId[]): Ops<TData> {
  return ids.reduce((acc, id) => {
    const op = ops[id];
    op && (acc[id] = op);
    return acc;
  }, {});
}

export function searchOps<TData = any>(ops: Ops<TData>, query: string | RegExp): Ops<TData> {
  return Object.keys(ops).reduce((acc, id) => {
    if (query instanceof RegExp ? !!String(id).match(query) : String(id).indexOf(query) > -1) {
      acc[id] = ops[id];
    }

    return acc;
  }, {});
}
