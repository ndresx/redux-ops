import { combineReducers } from 'redux';

import reducer, { defaultState } from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import { constructOperation } from './utils';

describe('selectors', () => {
  const id = '123';
  let appReducer;
  let state;

  beforeEach(() => {
    appReducer = combineReducers({ settings: () => ({}), ops: reducer });
    state = appReducer({}, { type: 'init' });
  });

  it('should return ops state', () => {
    state = appReducer(state, actions.createOperation(id));
    expect(selectors.getOpsState(state)).toEqual({ ...defaultState, [id]: constructOperation(id) });
  });

  it('should return all operations', () => {
    state = appReducer(state, actions.createOperation(id));
    expect(selectors.getOps(state)).toEqual({ [id]: constructOperation(id) });
  });

  it('should return operations by id', () => {
    state = appReducer(state, actions.createOperation('123'));
    state = appReducer(state, actions.createOperation('456'));
    expect(selectors.getOpById(state, '456')).not.toEqual(constructOperation('123'));
    expect(selectors.getOpById(state, '456')).toEqual(constructOperation('456'));
  });

  it('should return operations by ids', () => {
    state = appReducer(state, actions.createOperation('123'));
    state = appReducer(state, actions.createOperation('456'));
    state = appReducer(state, actions.createOperation('789'));
    expect(selectors.getOpByIds(state, ['456', '123'])).toEqual({
      ['123']: constructOperation('123'),
      ['456']: constructOperation('456'),
    });
  });

  it('should search operations by id', () => {
    state = appReducer(state, actions.createOperation('123'));
    state = appReducer(state, actions.createOperation('456'));
    state = appReducer(state, actions.createOperation(789));
    expect(selectors.searchOps(state, /abc/)).toEqual({});
    expect(selectors.searchOps(state, /45/)).toEqual({ ['456']: constructOperation('456') });
    expect(selectors.searchOps(state, '456')).toEqual({ ['456']: constructOperation('456') });
    expect(selectors.searchOps(state, '45')).toEqual({ ['456']: constructOperation('456') });
    expect(selectors.searchOps(state, '789')).toEqual({ [789]: constructOperation(789) });
    expect(selectors.searchOps(state, '0')).toEqual({});
    expect(selectors.searchOps(state, /2|6/)).toEqual({
      ['123']: constructOperation('123'),
      ['456']: constructOperation('456'),
    });
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
