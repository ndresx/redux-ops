import * as index from './index';

describe('index', () => {
  it('should export', () => {
    expect(index).toMatchSnapshot();
  });
});
