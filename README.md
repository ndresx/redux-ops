# redux-ops [![npm][npm]][npm-url] [![CI: Build Status](https://img.shields.io/github/workflow/status/ndresx/redux-ops/CI)](https://github.com/ndresx/redux-ops/actions/workflows/main.yml) [![Coverage Status](https://coveralls.io/repos/github/ndresx/redux-ops/badge.svg?branch=master)](https://coveralls.io/github/ndresx/redux-ops?branch=master)

A Redux reducer/middleware for managing asynchronous and operational states.

- [Getting Started](#getting-started)
- [Motivation](#motivation)
- [Examples](#examples)
  - [Introduction: Operations](#introduction-operations)
  - [Blueprints & Middleware](#blueprints--middleware)
- [Documentation](#documentation)
- [License](#license)

## Getting Started

You can either install the module via `npm` or `yarn`:

```
npm install redux-ops --save
```

```
yarn add redux-ops
```

## Motivation

Maintaining asynchronous and operational states is an integral part of almost every modern (web) app, but an often discussed topic when it comes to their implementation and the Redux state structure to store them accordingly.

`redux-ops` is trying to take this concern away by providing a reducer, an optional middleware with action creator Blueprints, actions, selectors and utilities to

- **maintain** aforementioned states in a more consistent way (e.g. requests, transaction-like processes),
- **communicate** these async/operational state transitions,
- **prevent cluttering** of state slices with individual sub-states
- and to have a **centralized place** to store them.

## Examples

### Introduction: Operations

At its core, `redux-ops` consists of a reducer with a set of actions for the creation, update and deletion of Operations.

An Operation represents any async or operational task in the form of the following object that gets updated and persisted within the `opsReducer`.

```js
{
  id: '74168d',
  status: 'success',
  data: [{ "id": 1, "name": "Jurassic World" }],
}
```

In the following example, we are going to fetch some movie data from a server and use these core actions to perform the state transitions.

```js
import { createStore, combineReducers } from 'redux';
import opsReducer, { actions, selectors } from 'redux-ops';

// Create store and set up the reducer
const store = createStore(combineReducers({ ops: opsReducer }));
```

```js
// Create an Operation in its default state
const opId = '74168d';
dispatch(actions.startOperation(opId));

// State => { ops: { id: '74168d', status: 'started' } }
```

```js
// Fetch movies and update the previously created Operation
fetch('https://example.com/movies.json')
  .then(response => response.json())
  .then(movies => dispatch(actions.updateOperation(opId, OpStatus.Success, movies)))
  .catch(error => dispatch(actions.updateOperation(opId, OpStatus.Error, error.message)));

// State => { ops: { id: '74168d', status: 'success', data: {...} } }
```

A set of selectors and utility functions allows to, for example, retrieve the current state of an Operation, or clean it up when it's no longer needed.

```js
// Get the Operation state by using one of the provided selectors
console.log(selectors.getOpById(store.getState(), opId));

// Op => { id: '74168d', status: 'success', data: {...} }
```

```js
// Delete the Operation
dispatch(actions.deleteOperation(opId));

// State => { ops: {} }
```

[Live Demo](https://codesandbox.io/s/sharp-buck-120j0)

### Blueprints & Middleware

`redux-ops` also comes with an optional [middleware](docs/Middleware.md) that enables the usage of so-called action [Blueprints](docs/Blueprints.md) to reduce boilerplate by either using already defined action creators like the ones in the example below or by solely relying on the built-in Operations.

```js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import opsReducer, { opsMiddleware } from 'redux-ops';

// Set up reducer and apply the middleware
const store = createStore(
  combineReducers({ ops: opsReducer },
  applyMiddleware(opsMiddleware)
);
```

```js
// We can either create/use existing actions (recommended), or let the Blueprints handle it for us.
const fetchMovies = () => ({ type: movieFetcher.START });
const didFetchMovies = movies => ({ type: movieFetcher.SUCCESS, payload: { movies } });
```

The [`createBlueprint`](docs/Blueprints.md) function wraps our action creators into actions that will be processed by the middleware.

Since we already have two designated action creators to initiate (`fetchMovies`) and complete (`didFetchMovies`) the Operation, we can leverage them, or let the auto-generated action creators handle non-defined cases such as the `error` one, which we decided to not define for now.

```js
import { createBlueprint } from 'redux-ops';

// Create a new Blueprint for managing state
const movieFetcher = createBlueprint('FETCH_MOVIES', {
  start: fetchMovies,
  success: didFetchMovies,
});
```

When creating a new Blueprint, an `id`/action type needs to be passed in. This identifier can be a `string` or `number` and is, amongst other use cases, also utilized for other concepts such as [Operation broadcasting](docs/Blueprints.md#operation-broadcasting) and [unique Operations](docs/Blueprints.md#unique-operations).

To kick-off the Operation, we need to dispatch the `movieFetcher.start()` action.

```js
dispatch(movieFetcher.start());
```

The middleware will process the Blueprint-Action, start a new Operation with the id `FETCH_MOVIES` (_which can be chosen arbitrarily and is not directly related to existing types_) and additionally dispatch the original `fetchMovies()` action.

The request itself can then be sent in whatever way you prefer.

```js
// Fetch movies and update the previously started Operation
fetch('https://example.com/movies.json')
  .then(response => response.json())
  .then(movies => dispatch(movieFetcher.success(movies)))
  .catch(error => dispatch(movieFetcher.error(error.message));
```

```js
// Get the Operation state by using one of the provided selectors
console.log(selectors.getOpById(store.getState(), movieFetcher.id));
```

```js
// Delete the Operation if needed
dispatch(movieFetcher.delete());
```

[Live Demo](https://codesandbox.io/s/nervous-river-3bqer)

## Documentation

- [Actions](docs/Actions.md)
- [Selectors](docs/Selectors.md)
- [Utility](docs/Utility.md)
- [Blueprints](docs/Blueprints.md)
- [Middleware](docs/Middleware.md)

## License

MIT

[npm]: https://img.shields.io/npm/v/redux-ops.svg
[npm-url]: https://npmjs.com/package/redux-ops
