import {
  createBlueprint,
  uniqueOp,
  broadcastOp,
  getUniqueId,
  createBlueprintActionTypes,
} from './index';
import { OpBlueprint, BlueprintActionKey } from './typedefs';
import { fetchMovies, FETCH_MOVIES, movies } from './fixtures';
import { prefix } from '../action_types';

describe('blueprint', () => {
  describe('createBlueprint', () => {
    function testActions(
      blueprint: OpBlueprint,
      blueprintArguments: { [key in BlueprintActionKey]?: unknown[] } = {}
    ): void {
      expect(blueprint).toMatchSnapshot();

      for (const key in BlueprintActionKey) {
        it(key, () => {
          const keyValue = BlueprintActionKey[key];
          expect(blueprint[keyValue](...(blueprintArguments[keyValue] || []))).toMatchSnapshot();
        });
      }
    }

    describe('should create blueprint with default actions', () => {
      testActions(createBlueprint(FETCH_MOVIES));
    });

    describe('should create blueprint with default actions and custom payloads', () => {
      testActions(createBlueprint(FETCH_MOVIES), {
        start: ['Science-Fiction', 1],
        success: [movies],
        error: [new Error('404').message],
      });
    });

    describe('should create blueprint with custom actions', () => {
      testActions(
        createBlueprint(FETCH_MOVIES, {
          start: fetchMovies,
        }),
        {
          start: ['Science-Fiction', 1],
          success: [movies],
          error: [new Error('404').message],
        }
      );
    });

    it('should create blueprint action types', () => {
      expect(createBlueprintActionTypes(FETCH_MOVIES)).toMatchSnapshot();
    });
  });

  describe('uniqueOp', () => {
    let blueprintModule;

    beforeEach(() => {
      blueprintModule = require('./index');
    });

    it('should assign unique id(s) to blueprint action', () => {
      const blueprint = blueprintModule.createBlueprint(FETCH_MOVIES);
      const startAction = blueprint.start();

      const firstStartAction = blueprintModule.uniqueOp(startAction);
      expect(firstStartAction[prefix].uniqueId).toMatchInlineSnapshot(`"@@redux-ops/_1"`);

      const secondStartAction = blueprintModule.uniqueOp(startAction);
      expect(secondStartAction[prefix].uniqueId).toMatchInlineSnapshot(`"@@redux-ops/_2"`);
    });

    it('should re-assign unique id to existing blueprint action', () => {
      const blueprint = blueprintModule.createBlueprint(FETCH_MOVIES);
      const startAction = blueprint.start();

      const firstStartAction = blueprintModule.uniqueOp(startAction);
      expect(firstStartAction[prefix].uniqueId).toMatchInlineSnapshot(`"@@redux-ops/_1"`);

      const secondStartAction = blueprintModule.uniqueOp(startAction, firstStartAction);
      expect(secondStartAction[prefix].uniqueId).toMatchInlineSnapshot(`"@@redux-ops/_1"`);
    });

    it('should assign custom unique id to blueprint action', () => {
      const blueprint = blueprintModule.createBlueprint(FETCH_MOVIES);
      const startAction = blueprint.start();

      const firstStartAction = blueprintModule.uniqueOp(startAction, '123');
      expect(firstStartAction[prefix].uniqueId).toMatchInlineSnapshot(`"123"`);

      const secondStartAction = blueprintModule.uniqueOp(startAction, firstStartAction);
      expect(secondStartAction[prefix].uniqueId).toMatchInlineSnapshot(`"123"`);
    });

    it('should assign custom unique id to custom blueprint action', () => {
      const blueprint = blueprintModule.createBlueprint(FETCH_MOVIES, {
        start: fetchMovies,
      });
      const startAction = blueprint.start();

      expect(startAction[prefix].action!.uniqueId).toBeUndefined();
      expect(uniqueOp(startAction)[prefix].action!.uniqueId).toMatchInlineSnapshot(`undefined`);
    });

    it('should get unique id of blueprint action', () => {
      const blueprint = blueprintModule.createBlueprint(FETCH_MOVIES);
      const startAction = blueprint.start();

      expect(getUniqueId(startAction)).toBeUndefined();
      expect(getUniqueId(blueprintModule.uniqueOp(startAction))).toMatchInlineSnapshot(
        `"@@redux-ops/_1"`
      );
    });

    afterEach(() => {
      jest.resetModules();
    });
  });

  describe('broadcastOp', () => {
    it('should assign unique id(s) to blueprint action', () => {
      const blueprint = createBlueprint(FETCH_MOVIES);
      const startAction = blueprint.start();

      expect(startAction[prefix].broadcast).toBeUndefined();
      expect(broadcastOp(startAction)[prefix].broadcast).toBe(true);
    });
  });
});
