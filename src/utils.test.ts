import { createOperation } from './utils';
import { OpStatus } from './typedefs';

describe('utils', () => {
  const id = '123';

  it('should build operation without data', () => {
    expect(createOperation(id, OpStatus.Start)).toEqual({
      id,
      status: OpStatus.Start,
      data: undefined,
    });
  });

  it('should build operation with data', () => {
    const data = { abc: 123 };
    expect(createOperation(id, OpStatus.Start, data)).toEqual({
      id,
      status: OpStatus.Start,
      data,
    });
  });
});
