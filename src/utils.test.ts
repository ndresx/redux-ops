import { buildOperation } from './utils';
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
});
