import { Operation, OperationStatus } from './typedefs';

export function buildOperation<TData = any, TStatus = OperationStatus>(
  id: string,
  status?: TStatus,
  data?: TData
): Operation<TData, TStatus> {
  return { id, status: status || OperationStatus.Default, data };
}

export function getOpById<T>(ops: { [key: string]: T }, id: string): T | undefined {
  return ops[id];
}
