import { combineReducers, createStore, AnyAction } from 'redux';

import { createBlueprint, opsUnique, opsBroadcast, getUniqueId } from './index';
import { fetchMovies, didFetchMovies, FETCH_MOVIES, movies, MovieFetcherOp } from './fixtures';
import { prefix } from '../action_types';
import reducer from '../reducer';
import middleware from './middleware';

const store = createStore(combineReducers({ ops: reducer }));

describe('middleware', () => {
  let dispatch: jest.Mock;
  let next: jest.Mock;

  beforeEach(() => {
    dispatch = jest.fn();
    next = jest.fn();
  });

  function testMiddleware(action: AnyAction) {
    middleware({ dispatch, getState: store.getState })(next)(action);
  }

  function expectNext(action: AnyAction) {
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  }

  it('should pass through random action', () => {
    const action = { type: 'RANDOM' };

    testMiddleware(action);
    expect(dispatch).not.toHaveBeenCalled();

    expectNext(action);
  });

  it('should process blueprint action', () => {
    const blueprint = createBlueprint(FETCH_MOVIES);
    const action = blueprint.start();

    testMiddleware(action);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls).toEqual([[action[prefix].operationAction]]);

    expectNext(action);
  });

  it('should process blueprint start action with always preceding op action', () => {
    const blueprint = createBlueprint(FETCH_MOVIES, { start: fetchMovies });
    const action = blueprint.start();

    testMiddleware(action);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls).toEqual([
      [action[prefix].operationAction],
      [action[prefix].originalAction],
    ]);

    expectNext(action);
  });

  it('should process blueprint custom action(s) with subsequent op action', () => {
    const blueprint = createBlueprint(FETCH_MOVIES, { success: didFetchMovies });
    const action = blueprint.success();

    testMiddleware(action);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls).toEqual([
      [action[prefix].originalAction],
      [action[prefix].operationAction],
    ]);

    expectNext(action);
  });

  it('should process blueprint delete action', () => {
    const blueprint = createBlueprint(FETCH_MOVIES);
    const action = blueprint.delete();

    testMiddleware(action);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(action[prefix].operationAction);

    expectNext(action);
  });

  describe('unique id', () => {
    it('should overwrite original op action id with unique id', () => {
      const blueprint = createBlueprint(FETCH_MOVIES);
      const action = opsUnique(blueprint.start());

      testMiddleware(action);
      expect(dispatch.mock.calls).toMatchSnapshot();

      const dispatchActionId = dispatch.mock.calls[0][0].payload.id;
      expect(dispatchActionId).not.toBe(action[prefix].operationAction.payload.id);
      expect(dispatchActionId).toMatchInlineSnapshot(`"@@redux-ops/FETCH_MOVIES_1"`);

      expectNext(action);
    });

    it('should attach unique id to custom action', () => {
      const blueprint = createBlueprint<MovieFetcherOp>(FETCH_MOVIES, {
        start: fetchMovies,
      });
      const action = opsUnique(blueprint.start('Science-Fiction'));

      testMiddleware(action);
      expect(dispatch.mock.calls).toMatchSnapshot();

      const customAction = dispatch.mock.calls[1][0];
      expect(customAction[prefix]).toEqual({ uniqueId: getUniqueId(action) });

      expectNext(action);
    });

    it('should attach unique id to broadcast action', () => {
      const blueprint = createBlueprint<MovieFetcherOp>(FETCH_MOVIES, {
        start: fetchMovies,
      });
      const action = opsUnique(opsBroadcast(blueprint.start('Science-Fiction')));

      testMiddleware(action);
      expect(dispatch.mock.calls).toMatchSnapshot();

      const broadcastAction = dispatch.mock.calls[1][0];
      expect(broadcastAction[prefix]).toEqual({ uniqueId: getUniqueId(action) });

      expectNext(action);
    });
  });

  describe('broadcast', () => {
    it('should broadcast blueprint action by using the default action creator', () => {
      const blueprint = createBlueprint(FETCH_MOVIES);
      const action = opsBroadcast(blueprint.start());

      testMiddleware(action);
      expect(dispatch.mock.calls).toMatchSnapshot();

      expectNext(action);
    });

    it('should broadcast unique blueprint action by using the default action creator', () => {
      const blueprint = createBlueprint(FETCH_MOVIES);
      const action = opsUnique(opsBroadcast(blueprint.start()));

      testMiddleware(action);
      expect(dispatch.mock.calls).toMatchSnapshot();

      expectNext(action);
    });

    it('should broadcast an updating blueprint action by using the default action creator', () => {
      const blueprint = createBlueprint<MovieFetcherOp>(FETCH_MOVIES);
      const action = opsUnique(opsBroadcast(blueprint.success(movies)));

      testMiddleware(action);
      expect(dispatch.mock.calls).toMatchSnapshot();

      expectNext(action);
    });

    it('should broadcast blueprint action by using a custom action creator', () => {
      const blueprint = createBlueprint<MovieFetcherOp>(FETCH_MOVIES, { success: didFetchMovies });
      const action = opsBroadcast(blueprint.success(movies));

      testMiddleware(action);
      expect(dispatch.mock.calls).toMatchSnapshot();

      expectNext(action);
    });

    it('should broadcast unique blueprint action by using a custom action creator', () => {
      const blueprint = createBlueprint<MovieFetcherOp>(FETCH_MOVIES, { success: didFetchMovies });
      const action = opsUnique(opsBroadcast(blueprint.success(movies)));

      testMiddleware(action);
      expect(dispatch.mock.calls).toMatchSnapshot();

      expectNext(action);
    });

    it('should broadcast delete action', () => {
      const blueprint = createBlueprint(FETCH_MOVIES);
      const action = opsBroadcast(blueprint.delete());

      testMiddleware(action);
      expect(dispatch.mock.calls).toMatchSnapshot();

      expectNext(action);
    });
  });
});
