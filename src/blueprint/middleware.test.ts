import { combineReducers, createStore, AnyAction } from 'redux';

import { createBlueprint, uniqueOp, broadcastOp, getUniqueId } from './index';
import { OpBlueprint, BlueprintActionKey, OpBlueprintFn } from './typedefs';
import { requestFetchMovies, didFetchMovies, FETCH_MOVIES, movies } from './fixtures';
import { prefix } from '../action_types';
import reducer from '../reducer';
import middleware from './middleware';

const store = createStore(combineReducers({ ops: reducer }));

interface MovieFetcherOp extends OpBlueprint {
  readonly start: OpBlueprintFn<typeof requestFetchMovies>;
  readonly success: OpBlueprintFn<typeof didFetchMovies>;
}

describe('middleware', () => {
  let dispatch;
  let next;

  beforeEach(() => {
    dispatch = jest.fn();
    next = jest.fn();
  });

  function testMiddleware(action: AnyAction) {
    middleware({ dispatch, getState: store.getState })(next)(action);
  }

  it('should process random action', () => {
    const action = { type: 'RANDOM' };

    testMiddleware(action);
    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith(action);
  });

  it('should process blueprint action', () => {
    const blueprint = createBlueprint(FETCH_MOVIES);
    const action = blueprint.start();

    testMiddleware(action);
    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith(action[prefix].op);
  });

  it('should process blueprint start action with always preceding op action', () => {
    const blueprint = createBlueprint(FETCH_MOVIES, { start: requestFetchMovies });
    const action = blueprint.start();

    testMiddleware(action);
    expect(next).toBeCalledTimes(2);
    expect(next.mock.calls).toEqual([[action[prefix].op], [action[prefix].action]]);
  });

  it('should process blueprint custom action(s) with subsequent op action', () => {
    const blueprint = createBlueprint(FETCH_MOVIES, { success: didFetchMovies });
    const action = blueprint.success();

    testMiddleware(action);
    expect(next).toBeCalledTimes(2);
    expect(next.mock.calls).toEqual([[action[prefix].action], [action[prefix].op]]);
  });

  it('should process blueprint delete action', () => {
    const blueprint = createBlueprint(FETCH_MOVIES);
    const action = blueprint.delete();

    testMiddleware(action);
    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith(action[prefix].op);
  });

  describe('unique id', () => {
    it('should overwrite original op action id with unique id', () => {
      const blueprint = createBlueprint(FETCH_MOVIES);
      const action = uniqueOp(blueprint.start());

      testMiddleware(action);
      expect(next).toBeCalledTimes(1);

      const nextActionId = next.mock.calls[0][0].payload.id;
      expect(nextActionId).not.toBe(action[prefix].op.payload.id);
      expect(nextActionId).toMatchInlineSnapshot(`"@@redux-ops/_1"`);
    });

    it('should attach unique id to custom action', () => {
      const blueprint = createBlueprint<MovieFetcherOp>(FETCH_MOVIES, {
        start: requestFetchMovies,
      });
      const action = uniqueOp(blueprint.start('Science-Fiction'));

      testMiddleware(action);
      expect(next).toBeCalledTimes(2);

      const customAction = next.mock.calls[1][0];
      expect(customAction[prefix]).toEqual({ uniqueId: getUniqueId(action) });
    });

    it('should attach unique id to broadcast action', () => {
      const blueprint = createBlueprint<MovieFetcherOp>(FETCH_MOVIES, {
        start: requestFetchMovies,
      });
      const action = uniqueOp(broadcastOp(blueprint.start('Science-Fiction')));

      testMiddleware(action);
      expect(next).toBeCalledTimes(3);

      const broadcastAction = next.mock.calls[1][0];
      expect(broadcastAction[prefix]).toEqual({ uniqueId: getUniqueId(action) });
    });
  });

  describe('broadcast', () => {
    it('should broadcast blueprint action by creating/deriving a new action from op state', () => {
      const blueprint = createBlueprint<MovieFetcherOp>(FETCH_MOVIES, { success: didFetchMovies });
      const action = broadcastOp(blueprint.success(movies));
      const opAction = action[prefix].op;

      testMiddleware(action);
      expect(next).toBeCalledTimes(3);
      expect(next.mock.calls).toEqual([
        [action[prefix].action],
        [
          {
            type: `${FETCH_MOVIES}_SUCCESS`,
            payload: opAction.payload,
            [prefix]: undefined,
          },
        ],
        [action[prefix].op],
      ]);
    });

    it('should not broadcast delete action', () => {
      const blueprint = createBlueprint(FETCH_MOVIES);
      const action = broadcastOp(blueprint.delete());

      testMiddleware(action);
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith(action[prefix].op);
    });
  });
});
