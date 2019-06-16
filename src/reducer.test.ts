import reducer, { defaultState } from './reducer';
import * as actions from './actions';
import { constructOperation } from './utils';
import { OpStatus } from './typedefs';

describe('reducer', () => {
  const id = '123';
  let state;

  beforeEach(() => {
    state = { ...defaultState };
  });

  it('should return default state', () => {
    expect(reducer({}, { type: 'invalid' })).toEqual(defaultState);
  });

  it('should return default state for invalid action types', () => {
    expect(reducer(state, { type: 'invalid' })).toEqual(defaultState);
  });

  it('should create new operation', () => {
    expect(reducer(state, actions.createOperation(id))).toEqual({
      ...defaultState,
      [id]: constructOperation(id),
    });
  });

  it('should not be able to create operation with the same id', () => {
    state = reducer(state, actions.createOperation(id));
    state = reducer(state, actions.createOperation(id));
    expect(state).toEqual({ ...defaultState, [id]: constructOperation(id) });
  });

  it('should create multiple operations', () => {
    state = reducer(state, actions.createOperation('123'));
    state = reducer(state, actions.createOperation('456'));
    expect(state).toEqual({
      ...defaultState,
      ['123']: constructOperation('123'),
      ['456']: constructOperation('456'),
    });
  });

  it('should update existing operation', () => {
    state = reducer(state, actions.createOperation(id));
    state = reducer(state, actions.updateOperation(id, OpStatus.Loading));
    expect(state).toEqual({ ...defaultState, [id]: constructOperation(id, OpStatus.Loading) });

    state = reducer(state, actions.updateOperation(id, OpStatus.Success));
    expect(state).toEqual({ ...defaultState, [id]: constructOperation(id, OpStatus.Success) });
  });

  it('should not be able to update non-existing operation', () => {
    state = reducer(state, actions.updateOperation(id, OpStatus.Loading));
    expect(state).toEqual(defaultState);
  });

  it('should delete operation', () => {
    const deleteId = '123';
    state = reducer(state, actions.createOperation(deleteId));
    state = reducer(state, actions.createOperation('456'));
    expect(state).toEqual({
      ...defaultState,
      [deleteId]: constructOperation(deleteId),
      ['456']: constructOperation('456'),
    });

    state = reducer(state, actions.deleteOperation(deleteId));
    expect(state).toEqual({ ...defaultState, ['456']: constructOperation('456') });
  });

  it('should delete multiple operations', () => {
    state = reducer(state, actions.createOperation('123'));
    state = reducer(state, actions.createOperation('456'));
    state = reducer(state, actions.createOperation('789'));
    expect(state).toEqual({
      ...defaultState,
      ['123']: constructOperation('123'),
      ['456']: constructOperation('456'),
      ['789']: constructOperation('789'),
    });

    state = reducer(state, actions.deleteOperation(['456', '789']));
    expect(state).toEqual({ ...defaultState, ['123']: constructOperation('123') });
  });

  it('should clear all existing operations', () => {
    state = reducer(state, actions.createOperation('123'));
    state = reducer(state, actions.createOperation('456'));
    state = reducer(state, actions.clearOperations());
    expect(state).toEqual(defaultState);
  });

  it('should extend the default reducer', () => {
    state = reducer(state, actions.createOperation('123'));
    state = reducer(state, actions.createOperation('456'));
    state = reducer(state, actions.clearOperations());
    expect(state).toEqual(defaultState);
  });
});
