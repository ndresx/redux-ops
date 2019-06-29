import {
  createBlueprint,
  opsUnique,
  opsBroadcast,
  getUniqueId,
  createBlueprintActionTypes,
} from './index';
import { OpBlueprint, BlueprintActionKey } from './typedefs';
import { fetchMovies, FETCH_MOVIES, movies, didFetchMovies } from './fixtures';
import { prefix } from '../action_types';

describe('blueprint', () => {
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

  describe('createBlueprint', () => {
    describe('should create blueprint with default actions', () => {
      testActions(createBlueprint(FETCH_MOVIES));
    });

    describe('should create blueprint with default actions and custom payloads', () => {
      testActions(createBlueprint(FETCH_MOVIES), {
        start: [fetchMovies('Science-Fiction', 1).payload],
        success: [movies],
        error: [new Error('404').message],
      });
    });

    describe('should create blueprint with custom actions', () => {
      testActions(
        createBlueprint(FETCH_MOVIES, {
          start: fetchMovies,
          success: didFetchMovies,
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

  describe('opsUnique', () => {
    let blueprintModule;

    beforeEach(() => {
      blueprintModule = require('./index');
    });

    it('should assign unique id(s) to blueprint action', () => {
      const blueprint = blueprintModule.createBlueprint(FETCH_MOVIES);
      const startAction = blueprint.start();

      const firstStartAction = blueprintModule.opsUnique(startAction);
      expect(firstStartAction[prefix].uniqueId).toMatchInlineSnapshot(
        `"@@redux-ops/FETCH_MOVIES_1"`
      );

      const secondStartAction = blueprintModule.opsUnique(startAction);
      expect(secondStartAction[prefix].uniqueId).toMatchInlineSnapshot(
        `"@@redux-ops/FETCH_MOVIES_2"`
      );
    });

    it('should re-assign unique id to existing blueprint action', () => {
      const blueprint = blueprintModule.createBlueprint(FETCH_MOVIES);
      const startAction = blueprint.start();

      const firstStartAction = blueprintModule.opsUnique(startAction);
      expect(firstStartAction[prefix].uniqueId).toMatchInlineSnapshot(
        `"@@redux-ops/FETCH_MOVIES_1"`
      );

      const secondStartAction = blueprintModule.opsUnique(startAction, firstStartAction);
      expect(secondStartAction[prefix].uniqueId).toMatchInlineSnapshot(
        `"@@redux-ops/FETCH_MOVIES_1"`
      );
    });

    it('should assign custom unique id to blueprint action', () => {
      const blueprint = blueprintModule.createBlueprint(FETCH_MOVIES);
      const startAction = blueprint.start();

      const firstStartAction = blueprintModule.opsUnique(startAction, '123');
      expect(firstStartAction[prefix].uniqueId).toMatchInlineSnapshot(`"123"`);

      const secondStartAction = blueprintModule.opsUnique(startAction, firstStartAction);
      expect(secondStartAction[prefix].uniqueId).toMatchInlineSnapshot(`"123"`);
    });

    it('should assign custom unique id to custom blueprint action', () => {
      const blueprint = blueprintModule.createBlueprint(FETCH_MOVIES, {
        start: fetchMovies,
      });
      const startAction = blueprint.start();

      expect(startAction[prefix].action!.uniqueId).toBeUndefined();
      expect(opsUnique(startAction)[prefix].action!.uniqueId).toMatchInlineSnapshot(`undefined`);
    });

    it('should get unique id of blueprint action', () => {
      const blueprint = blueprintModule.createBlueprint(FETCH_MOVIES);
      const startAction = blueprint.start();

      expect(getUniqueId(startAction)).toBeUndefined();
      expect(getUniqueId(blueprintModule.opsUnique(startAction))).toMatchInlineSnapshot(
        `"@@redux-ops/FETCH_MOVIES_1"`
      );
    });

    it('should create blueprint with actions using unique ids', () => {
      const module: typeof import('./index') = require('./index');
      const blueprint = module.opsUnique(module.createBlueprint(FETCH_MOVIES));
      const blueprintCustomId = module.opsUnique(module.createBlueprint(FETCH_MOVIES), '123');

      for (const key in BlueprintActionKey) {
        const keyValue = BlueprintActionKey[key];
        expect(blueprint[keyValue]()[prefix].uniqueId).toBe('@@redux-ops/FETCH_MOVIES_1');
        expect(blueprintCustomId[keyValue]()[prefix].uniqueId).toBe('123');
      }

      jest.resetModules();
    });

    afterEach(() => {
      jest.resetModules();
    });
  });

  describe('opsBroadcast', () => {
    it('should create broadcast blueprint action', () => {
      const blueprint = createBlueprint(FETCH_MOVIES);
      const startAction = blueprint.start();

      expect(startAction[prefix].broadcast).toBeUndefined();
      expect(opsBroadcast(startAction)[prefix].broadcast).toBe(true);
    });

    it('should create blueprint with broadcast actions', () => {
      const module: typeof import('./index') = require('./index');
      const blueprint = module.opsBroadcast(module.createBlueprint(FETCH_MOVIES));

      for (const key in BlueprintActionKey) {
        const keyValue = BlueprintActionKey[key];
        expect(blueprint[keyValue]()[prefix].broadcast).toBe(true);
      }

      jest.resetModules();
    });
  });
});
