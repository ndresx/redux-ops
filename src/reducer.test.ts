import reducer, { defaultState } from './reducer';
import * as actions from './actions';
import { createOperation } from './utils';
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
    expect(reducer(state, actions.startOperation(id))).toEqual({
      ...defaultState,
      [id]: createOperation(id),
    });
  });

  it('should create new operation with data', () => {
    const data = { genre: 'Science-Fiction' };
    expect(reducer(state, actions.startOperation(id, data))).toEqual({
      ...defaultState,
      [id]: createOperation(id, OpStatus.Start, data),
    });
  });

  it('should create multiple operations', () => {
    state = reducer(state, actions.startOperation('123'));
    state = reducer(state, actions.startOperation('456'));
    expect(state).toEqual({
      ...defaultState,
      ['123']: createOperation('123'),
      ['456']: createOperation('456'),
    });
  });

  it('should update existing operation', () => {
    state = reducer(state, actions.startOperation(id));
    state = reducer(state, actions.updateOperation(id, OpStatus.Start));
    expect(state).toEqual({ ...defaultState, [id]: createOperation(id, OpStatus.Start) });

    state = reducer(state, actions.updateOperation(id, OpStatus.Success));
    expect(state).toEqual({ ...defaultState, [id]: createOperation(id, OpStatus.Success) });
  });

  it('should delete operation', () => {
    const deleteId = '123';
    state = reducer(state, actions.startOperation(deleteId));
    state = reducer(state, actions.startOperation('456'));
    expect(state).toEqual({
      ...defaultState,
      [deleteId]: createOperation(deleteId),
      ['456']: createOperation('456'),
    });

    state = reducer(state, actions.deleteOperation(deleteId));
    expect(state).toEqual({ ...defaultState, ['456']: createOperation('456') });
  });

  it('should clear all existing operations', () => {
    state = reducer(state, actions.startOperation('123'));
    state = reducer(state, actions.startOperation('456'));
    state = reducer(state, actions.resetOperations());
    expect(state).toEqual(defaultState);
  });

  it('should extend the default reducer', () => {
    state = reducer(state, actions.startOperation('123'));
    state = reducer(state, actions.startOperation('456'));
    state = reducer(state, actions.resetOperations());
    expect(state).toEqual(defaultState);
  });
});
