import { Operation, OperationStatus } from './typedefs';

export function buildOperation<TData = any, TStatus = OperationStatus>(
  id: string,
  status?: TStatus,
  data?: TData
): Operation<TData, TStatus | OperationStatus> {
  return { id, status: status || OperationStatus.default, data };
}
