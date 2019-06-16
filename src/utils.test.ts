import { constructOperation } from './utils';
import { OpStatus } from './typedefs';

describe('utils', () => {
  const id = '123';

  it('should build operation without data', () => {
    expect(constructOperation(id, OpStatus.Default)).toEqual({
      id,
      status: OpStatus.Default,
      data: undefined,
    });
  });

  it('should build operation with data', () => {
    const data = { abc: 123 };
    expect(constructOperation(id, OpStatus.Default, data)).toEqual({
      id,
      status: OpStatus.Default,
      data,
    });
  });
});
