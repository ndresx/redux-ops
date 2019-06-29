# Blueprints

- [Introduction](#introduction)
- [Using Custom Action Creators](#using-custom-action-creators)
- [Unique Operations](#unique-operations)
- [Operation Broadcasting](#operation-broadcasting)
- [API](#api)

## Introduction

Blueprints consist of a set of actions that are mapped to `redux-ops`' primary operational [`actions`](Actions.md), including `start`, `success`, `error` and `delete`, with the main purpose of reducing boilerplate and simplifying state management.

> The setup of the [`opsMiddleware`](Middleware.md) is required for Blueprints to work.

A Blueprint is created by calling `createBlueprint()` with an id/action type that represents it from now on and an optional [action creator mapping](#using-custom-action-creators) for aforementioned actions.

```js
import { createBlueprint } from 'redux-ops';

// Create a new Blueprint for managing state
const movieFetcher = createBlueprint('FETCH_MOVIES');
```

To kick-off the Operation, we need to dispatch the `movieFetcher.start()` action.

```js
dispatch(movieFetcher.start());
```

The middleware will process the Blueprint-Action, start a new Operation with the id `FETCH_MOVIES` (_which can be chosen arbitrarily and is not directly related to existing types_) and additionally dispatch the original `fetchMovies()` action.

The request itself can then be sent in whatever way.

```js
// Fetch movies and update the previously started Operation
fetch('https://example.com/movies.json')
  .then(response => response.json())
  .then(movies => dispatch(movieFetcher.success(movies)))
  .catch(error => dispatch(movieFetcher.error(error.message));
```

Blueprints utilize existing `redux-ops` functionality so that their resulting actions are interchangeably usable with the package's core [`actions`](Actions.md).

```js
// Get the Operation state by using one of the provided selectors
console.log(selectors.getOpById(store.getState(), movieFetcher.getUniqueId()));

// Delete the Operation if needed
dispatch(movieFetcher.delete());
```

[Live Demo](https://codesandbox.io/s/nervous-river-3bqer)

## Using Custom Action Creators

Straight copied from the [main example](../README.md#example), these are some action creators our app might have already defined somewhere.

```js
// We can either create/use existing actions (recommended), or let the Blueprints handle it for us.
const fetchMovies = () => ({ type: 'FETCH_MOVIES' });
const didFetchMovies = movies => ({ type: 'FETCH_MOVIES_SUCCESS', payload: { movies } });
```

Because we already have them to initiate (`fetchMovies`) and complete (`didFetchMovies`) the Operation, we can leverage them, or let the auto-generated action creators handle non-defined cases such as the `error` one, which we didn't define (yet).

```js
// Create a new Blueprint for managing state
const movieFetcher = createBlueprint('FETCH_MOVIES', {
  start: fetchMovies,
  success: didFetchMovies,
});
```

Applying this mapping composes the custom action creator with the `redux-ops` internal/aforementioned ones and dispatches the custom actions simultaneously to the built-in Operations.

This has the advantage that we only have to dispatch a single action to manage our request state, but also to update any other app state via the custom action.

`redux-ops` supports TypeScript. `createBlueprint`, `opsUnique` and `opsBroadcast` support a generic type to type the mapped action creators accordingly to their original parameter signature.

```ts
interface MovieFetcherOp extends OpBlueprint {
  readonly start: OpBlueprintFn<typeof fetchMovies>;
  readonly success: OpBlueprintFn<typeof didFetchMovies>;
}

const movieFetcher = createBlueprint<MovieFetcherOp>('FETCH_MOVIES', {
  start: fetchMovies,
  success: didFetchMovies,
});
```

## Unique Operations

Each Operation has an identifier `id`. It can be unique, or reusable, e.g. an action type like `FETCH_MOVIES`, or a number like `123`. `redux-ops` doesn't enforce unique ids as not all processes require it, but it provides some functionality to turn Blueprints or its actions into unique Operations.

Based on the [first example](../README.md#example), we can achieve this in different ways. We can define a unique id when creating a new Blueprint, or compose the entire Blueprint object or a Blueprint action with the `opsUnique` function, which injects the unique id.

```js
// Inject a unique id for all Blueprint actions
const movieFetcherUnique = opsUnique(movieFetcher);
```

When using `opsUnique`, every Operation within the Blueprint object gets a unique id. Instead of `FETCH_MOVIES`, the into `createBlueprint` previously passed id/action type would become something like `@@redux-ops/FETCH_MOVIES_1`.

Both functions also allow you to pass in a custom id or re-using another Blueprint action's unique id as the second argument as you can see in the following example.

```js
// Auto-generated id
opsUnique(startingAction);

// Custom id
opsUnique(startingAction, '74168d');
```

Because the Blueprint actions aren't aware of each other, continuous action dispatching requires to keep this unique id alive, unless it has been generated with the Blueprint.

```js
// Inherit unique id from starting action
dispatch(opsUnique(movieFetcher.success(), startingAction));

// Simply re-use custom id from before
dispatch(opsUnique(movieFetcher.success(), '74168d'));

// getUniqueId(blueprintAction) returns the unique id of a Blueprint action
dispatch(actions.update(getUniqueId(startingAction), OpStatus.success));
```

## Operation Broadcasting

Operations can be broadcasted based on the given id/action type that has been used to create a Blueprint. Broadcasting is only useful if no custom actions have been passed into the Blueprint creator as it replicates the original Operation and combines it with the current Operation status and `data` payload.

_Note: The `data` payload of the original Operation gets moved to the Broadcast-Action to avoid duplicate data in the state._

### Example

In the example above, we didn't pass any custom action creators into the Blueprint creator, which means that `redux-ops` handles everything internally.

However, we could broadcast these Blueprint actions via `opsBroadcast` so that other reducers can start listening to it without having to create new action creators.

```js
// Enable broadcasting for all Blueprint actions
const movieFetcherBroadcaster = opsBroadcast(movieFetcher);
```

Dispatching one of these newly composed actions results in the by `redux-ops` generated Operation, but also in a from this action derived Broadcast-Action.

```js
dispatch(movieFetcherBroadcaster.start('Science-Fiction'));

// Only broadcasting a single Blueprint action
dispatch(opsBroadcast(movieFetcher.start('Science-Fiction'));
```

Through the [middleware](Middleware.md) effectively dispatched actions:

#### Operation-Action

```js
{
  type: '@@redux-ops/START',
  payload:  {
    id: 'FETCH_MOVIES',
    status: 'started',
    data: undefined, // This would be 'Science-Fiction' without broadcasting
  },
}
```

#### Broadcast-Action

```js
{
  type: 'FETCH_MOVIES_STARTED',
  payload: 'Science-Fiction',
}
```

## API

### `createBlueprint(id, [mapping])`

Creates a new Blueprint with the given `id`/action type. The optional mapping can be used to compose new/existing action creators with the built-in Operations (`start`, `success`, `error` and `delete`).

Please check the [introduction](#introduction) for more information and examples.

### `opsUnique(blueprint|blueprintAction)`

Injects a [unique identifier](#unique-operations) into all actions within a given Blueprint (created through [`createBlueprint`](#createBlueprint)) or a single Blueprint-Action.

### `opsBroadcast(blueprint|blueprintAction)`

Signalizes that all actions within a given Blueprint (created through [`createBlueprint`](#createBlueprint)) or a single Blueprint-Action should be [broadcasted](#operation-broadcasting) by the middleware.
