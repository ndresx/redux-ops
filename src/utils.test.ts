import { buildOperation, getOpById } from './utils';
import { OperationStatus } from './typedefs';

describe('utils', () => {
  const id = '123';

  it('should build operation without data', () => {
    expect(buildOperation(id, OperationStatus.Default)).toEqual({
      id,
      status: OperationStatus.Default,
      data: undefined,
    });
  });

  it('should build operation with data', () => {
    const data = { abc: 123 };
    expect(buildOperation(id, OperationStatus.Default, data)).toEqual({
      id,
      status: OperationStatus.Default,
      data,
    });
  });

  it('should return operation by id', () => {
    const op1 = buildOperation('123', OperationStatus.Default);
    const op2 = buildOperation('456', OperationStatus.Default);
    const ops = { [op1.id]: op1, [op2.id]: op2 };
    expect(getOpById(ops, op1.id)).toEqual(op1);
    expect(getOpById(ops, op2.id)).toEqual(op2);
    expect(getOpById(ops, 'abc')).toBeUndefined();
  });
});
