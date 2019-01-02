import { combineReducers } from 'redux';

import reducer, { defaultState } from './index';
import * as actions from './actions';
import * as selectors from './selectors';
import { buildOperation } from './utils';

describe('reducer', () => {
  const id = '123';
  let appReducer;
  let state;

  beforeEach(() => {
    appReducer = combineReducers({ settings: () => ({}), ops: reducer });
    state = appReducer({}, { type: 'init' });
  });

  it('should return ops state', () => {
    state = appReducer(state, actions.createOperation(id));
    expect(selectors.getOpsState(state)).toEqual({ ...defaultState, [id]: buildOperation(id) });
  });

  it('should return ops', () => {
    state = appReducer(state, actions.createOperation(id));
    expect(selectors.getOps(state)).toEqual({ [id]: buildOperation(id) });
  });

  it('should return op by id', () => {
    state = appReducer(state, actions.createOperation('123'));
    state = appReducer(state, actions.createOperation('456'));
    expect(selectors.getOpById(state, '456')).not.toEqual(buildOperation('123'));
    expect(selectors.getOpById(state, '456')).toEqual(buildOperation('456'));
  });

  it('should search ops by id', () => {
    state = appReducer(state, actions.createOperation('123'));
    state = appReducer(state, actions.createOperation('456'));
    expect(selectors.searchOps(state, /abc/)).toEqual([]);
    expect(selectors.searchOps(state, /45/)).toEqual([buildOperation('456')]);
    expect(selectors.searchOps(state, /2|6/)).toEqual([
      buildOperation('123'),
      buildOperation('456'),
    ]);
  });

  it('should allow custom reducer names', () => {
    const reducerName = 'asyncOps';
    selectors.setReducerName(reducerName);
    appReducer = combineReducers({ settings: () => ({}), [reducerName]: reducer });
    state = appReducer({}, { type: 'init' });

    expect(selectors.getOpsState(state)).toEqual(defaultState);
  });

  it('should fail if custom reducer name is not set properly', () => {
    const reducerName = 'asyncOps';
    appReducer = combineReducers({ settings: () => ({}), [reducerName]: reducer });
    expect(() => {
      selectors.getOpsState(state);
    }).toThrow();
  });
});
