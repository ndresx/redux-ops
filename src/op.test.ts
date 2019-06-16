import Op from './op';
import * as actions from './actions';
import { OpStatus } from './typedefs';

describe('Op', () => {
  const id = '123';
  const data = { statusCode: 200 };
  let op: Op;

  beforeEach(() => {
    op = new Op(id);
  });

  it('should create new Op object', () => {
    expect(op.getId()).toBe(id);
  });

  it('should return create action', () => {
    expect(op.create(OpStatus.Loading, data)).toEqual(
      actions.createOperation(id, OpStatus.Loading, data)
    );
  });

  it('should return update action', () => {
    expect(op.update(OpStatus.Loading, data)).toEqual(
      actions.updateOperation(id, OpStatus.Loading, data)
    );
  });

  it('should return delete action', () => {
    expect(op.delete()).toEqual(actions.deleteOperation(id));
  });
});
