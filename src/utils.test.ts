import { createOperation } from './utils';
import { OpStatus } from './typedefs';

describe('utils', () => {
  const id = '123';

  it('should build operation without data', () => {
    expect(createOperation(id, OpStatus.Started)).toEqual({
      id,
      status: OpStatus.Started,
      data: undefined,
    });
  });

  it('should build operation with data', () => {
    const data = { abc: 123 };
    expect(createOperation(id, OpStatus.Started, data)).toEqual({
      id,
      status: OpStatus.Started,
      data,
    });
  });
});
