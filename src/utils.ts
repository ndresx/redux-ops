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
  const result = {};

  ids.forEach(id => {
    const op = ops[id];
    op && (result[id] = op);
  });

  return result;
}

export function searchOps<TData = any>(ops: Ops<TData>, query: string | RegExp): Ops<TData> {
  const result = {};

  Object.keys(ops).forEach(id => {
    if (query instanceof RegExp ? !!String(id).match(query) : String(id).indexOf(query) > -1) {
      result[id] = ops[id];
    }
  });

  return result;
}
