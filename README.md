# redux-ops [![npm][npm]][npm-url] [![Build Status](https://travis-ci.org/ndresx/redux-ops.svg?branch=master)](https://travis-ci.org/ndresx/redux-ops) [![Coverage Status](https://coveralls.io/repos/github/ndresx/redux-ops/badge.svg?branch=master)](https://coveralls.io/github/ndresx/redux-ops?branch=master)

A Redux reducer/middleware for persisting asynchronous and operational states.

- [Getting Started](#getting-started)
- [Motivation](#motivation)
- [Example](#example)
  - [Introduction: **Operations**](#introduction-operations)
  - [**Blueprints & Middleware**](#extended-blueprints-middleware)
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

`redux-ops` is trying to take this concern away by providing a reducer, an optional middleware, actions, selectors and utilities to

- **maintain** aforementioned states in a more consistent way (e.g. requests, transaction-like processes),
- **communicate** these async/operational state transitions,
- **prevent cluttering** of state slices with individual sub-states
- and to have a **centralized place** to store them.

## Example

### Introduction: Operations

At its core, `redux-ops` provides actions for the creation, update and deletion of Operations, with the option, to also use it as a data store to some extent if needed.

An Operation represents any async or operational task in form of the following object that gets updated and persisted within the `ops-reducer`.

```js
{
  id: '74168d',
  status: 'success',
  data: [{ "id": 2, "name": "Jurassic World" }],
}
```

In the following example, We are going to fetch some movie data from a server and use these core actions to perform the state transitions.

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
  .then(movies => dispatch(actions.update(opId, OpStatus.Success, movies)))
  .catch(error => dispatch(actions.update(opId, OpStatus.Error, error.message)));

// State => { ops: { id: '74168d', status: 'success', data: {...} } }
```

A set of selectors and utility functions allows to, for example, retrieve the current state of an Operation, or clean it up when it's no longer needed.

```js
// Get the Operation state by using one of the provided selectors
console.log(selectors.getOpById(store.getState(), opId));

// Delete the Operation
dispatch(op.delete());

// State => { ops: {} }
```

[Live Demo](https://codesandbox.io/s/sharp-buck-120j0)

### Extended: Blueprints & Middleware

`redux-ops` also comes with an optional [middleware](docs/Middleware.md) that enables the usage of action [Blueprints](docs/Blueprints.md) to reduce boilerplate by either using already defined action creators like the ones in the example below, or by soley relying on the built-in Operations.

#### Setup

```js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import opsReducer, { middleware } from 'redux-ops';

// Set up reducer and apply the middleware
const store = createStore(
  combineReducers({ ops: opsReducer },
  applyMiddleware(middleware)
);
```

```js
// We can either create/use existing actions (recommended), or let the Blueprints handle it for us.
const fetchMovies = () => ({ type: 'FETCH_MOVIES' });
const didFetchMovies = movies => ({ type: 'FETCH_MOVIES_SUCCESS', payload: { movies } });
```

The [`createBlueprint`](docs/Blueprints.md) function simply wraps our action creators into actions that will then be processed by the middleware.

Since we already have two designated action creators to initiate (`fetchMovies`) and complete (`didFetchMovies`) the Operation, we can leverage them, or let the auto-generated action creators handle non-defined cases such as the `error` one, which we didn't define (yet).

```js
import { createBlueprint } from 'redux-ops';

// Create a new Blueprint for managing state
const movieFetcher = createBlueprint('FETCH_MOVIES', {
  start: fetchMovies,
  success: didFetchMovies,
});
```

When creating a new Blueprint, an id/action type needs to be passed in. This can be either a `string` or `number` and is utilized for Operation [broadcasting](docs/Blueprints.md#operation-broadcasting) and [unique](docs/Blueprints.md#unique-operations) Operations.

To kick-off the Operation, we need to dispatch the `movieFetcher.start()` action.

```js
dispatch(movieFetcher.start());
```

This will, on the one hand, start a new Operation with the id `FETCH_MOVIES` (_which can be chosen arbitrarily and is not directly related to existing types_), and furthermore, dispatch the original `fetchMovies()` action through the middleware.

The request itself can then be sent in whatever way. Also, note that we are dispatching `movieFetcher.error(null, ...)` here. Because we didn't define our own action creator, the error state will be only handled by the `ops-reducer` as it was shownn before.

```js
// Fetch movies and update the previously started Operation
fetch('https://example.com/movies.json')
  .then(response => response.json())
  .then(movies => dispatch(movieFetcher.success(movies)))
  .catch(error => dispatch(movieFetcher.error(null, error.message));
```

```js
// Get the Operation state by using one of the provided selectors
console.log(selectors.getOpById(store.getState(), movieFetcher.getUniqueId()));

// Delete the Operation if needed
dispatch(movieFetcher.delete());
```

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
