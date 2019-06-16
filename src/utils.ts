import { Operation, OpStatus, Ops, OpId } from './typedefs';

export function constructOperation<TStatus = OpStatus, TData = any>(
  id: OpId,
  status?: TStatus,
  data?: TData
): Operation<TStatus, TData> {
  return { id, status, data };
}

export function getOpById<TStatus = OpStatus, TData = any>(
  ops: Ops<TStatus, TData>,
  id: OpId
): Operation<TStatus, TData> | undefined {
  return ops[id];
}

export function getOpByIds<TStatus = OpStatus, TData = any>(
  ops: Ops<TStatus, TData>,
  ids: OpId[]
): Ops<TStatus, TData> {
  const result = {};

  ids.forEach(id => {
    const op = ops[id];
    op && (result[id] = op);
  });

  return result;
}

export function searchOps<TStatus = OpStatus, TData = any>(
  ops: Ops<TStatus, TData>,
  query: string | RegExp
): Ops<TStatus, TData> {
  const result = {};

  Object.keys(ops).forEach(id => {
    if (query instanceof RegExp ? !!String(id).match(query) : String(id).indexOf(query) > -1) {
      result[id] = ops[id];
    }
  });

  return result;
}
