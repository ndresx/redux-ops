import reducer, { defaultState } from './index';
import * as actions from './actions';
import { buildOperation } from './utils';
import { OperationStatus } from './typedefs';

describe('reducer', () => {
  const id = '123';
  let state;

  beforeEach(() => {
    state = { ...defaultState };
  });

  it('should return default state', () => {
    expect(reducer(undefined, { type: 'invalid' })).toEqual(defaultState);
  });

  it('should return default state for invalid action types', () => {
    expect(reducer(state, { type: 'invalid' })).toEqual(defaultState);
  });

  it('should create new operation', () => {
    expect(reducer(state, actions.createOperation(id))).toEqual({
      ...defaultState,
      [id]: buildOperation(id),
    });
  });

  it('should not be able to create operation with the same id', () => {
    state = reducer(state, actions.createOperation(id));
    state = reducer(state, actions.createOperation(id));
    expect(state).toEqual({ ...defaultState, [id]: buildOperation(id) });
  });

  it('should create multiple operations', () => {
    state = reducer(state, actions.createOperation('123'));
    state = reducer(state, actions.createOperation('456'));
    expect(state).toEqual({
      ...defaultState,
      ['123']: buildOperation('123'),
      ['456']: buildOperation('456'),
    });
  });

  it('should update existing operation', () => {
    state = reducer(state, actions.createOperation(id));
    state = reducer(state, actions.updateOperation(id, OperationStatus.loading));
    expect(state).toEqual({ ...defaultState, [id]: buildOperation(id, OperationStatus.loading) });

    state = reducer(state, actions.updateOperation(id, OperationStatus.success));
    expect(state).toEqual({ ...defaultState, [id]: buildOperation(id, OperationStatus.success) });
  });

  it('should not be able to update non-existing operation', () => {
    state = reducer(state, actions.updateOperation(id, OperationStatus.loading));
    expect(state).toEqual(defaultState);
  });

  it('should delete operation', () => {
    state = reducer(state, actions.deleteOperation('456'));
    expect(state).toEqual(defaultState);

    const deleteId = '123';
    state = reducer(state, actions.createOperation(deleteId));
    state = reducer(state, actions.createOperation('456'));
    expect(state).toEqual({
      ...defaultState,
      [deleteId]: buildOperation(deleteId),
      ['456']: buildOperation('456'),
    });

    state = reducer(state, actions.deleteOperation(deleteId));
    expect(state).toEqual({ ...defaultState, ['456']: buildOperation('456') });
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
