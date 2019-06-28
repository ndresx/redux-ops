# Blueprints

- [Getting Started](#getting-started)
- [Unique Operations](#unique-operations)
- [Operation Broadcasting](#operation-broadcasting)

## Getting Started

```js
// Create a new Blueprint for managing our states
const movieFetcher = createBlueprint('FETCH_MOVIES');
```

## Unique Operations

Each Operation has an identifier `id`. It can be unique, or re-usable, e.g. an action type like `FETCH_MOVIES`, or a number `123`. `redux-ops` doesn't enforce unique ids as not all processes require it, but it provides some functionality to turn Blueprints or its actions into unique Operations.

Based on the [main example](../README.md#example), we can achieve this in different ways. We can define a unique id when creating a new Blueprint, or compose the entire Blueprint object or a Blueprint action with the `opUnique` function, which injects the unique id.

```js
// Inject a unique id for all Blueprint actions
const movieFetcherUnique = opUnique(movieFetcher);
```

When using `opUnique`, every Operation within the Blueprint object will use a unique id. Instead of `FETCH_MOVIES`, the into `createBlueprint` previously passed id/action type would become something like `@@redux-ops/FETCH_MOVIES_1`.

Both functions also allow to pass in a custom id or re-using another Blueprint action's unique id as second argument as you can see in the following example.

```js
// Auto-generated id
opUnique(startingAction);

// Custom id
opUnique(startingAction, '74168d');
```

Because the Blueprint actions aren't really aware of each other, continous action dispatching requires to somehow keep this unique id alive, unless it has been generated with the Blueprint.

```js
// Inherit unique id from starting action
dispatch(opUnique(movieFetcher.success(), startingAction));

// Simply re-use custom id from before
dispatch(opUnique(movieFetcher.success(), '74168d'));

// getUniqueId(blueprintAction) returns the unique id of a Blueprint action
dispatch(actions.update(getUniqueId(startingAction), OpStatus.success));
```

## Operation Broadcasting

Operations can be broadcasted based on the given id/action type that has been used to create a Blueprint. Broadcasting is only useful if no custom actions have been passed into the Blueprint creator as it replicates the original Operation and combines it with the current Operation status and `data` payload.

_Note: The `data` payload of the original Operation gets moved to the Broadcast-Action to avoid duplicate data in the state._

### Example

In the example above, we didn't pass any custom action creators into the Blueprint creator, which means that `redux-ops` handles everything internally.

However, we could broadcast these Blueprint actions via `opBroadcast` so that other reducers can start listening to it without having to create new action creators.

```js
// Enable broadcasting for all Blueprint actions
const movieFetcherBroadcaster = opBroadcast(movieFetcher);
```

Dispatching one of these newly composed actions will result in the by `redux-ops` generated Operation, but also in a from this action derived Broadcast-Action.

```js
dispatch(movieFetcherBroadcaster.start('Science-Fiction'));

// Only broadcasting a single Blueprint action
dispatch(opBroadcast(movieFetcher.start('Science-Fiction'));
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
