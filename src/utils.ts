import { Operation, OperationStatus } from './typedefs';

export function buildOperation(
  id: string,
  status: OperationStatus = OperationStatus.default,
  data?: any
): Operation {
  return { id, status, data };
}
