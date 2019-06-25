# redux-ops [![npm][npm]][npm-url] [![Build Status](https://travis-ci.org/ndresx/redux-ops.svg?branch=master)](https://travis-ci.org/ndresx/redux-ops) [![Coverage Status](https://coveralls.io/repos/github/ndresx/redux-ops/badge.svg?branch=master)](https://coveralls.io/github/ndresx/redux-ops?branch=master)

A Redux reducer/middleware for persisting asynchronous and operational states.

- [Getting Started](#getting-started)
- [Motivation](#motivation)
- [Example](#example)
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

Maintaining asynchronous and operational states is an integral part of almost every modern (web) app, but an often discussed topic when it comes to structuring the Redux store state accordingly for their persistence.

`redux-ops` is trying to take this concern away by providing an `ops`-reducer, a middleware, actions and selectors to

- **maintain** aforementioned states in a more consistent way (e.g. requests),
- **communicate** whether something was successful or not,
- **prevent cluttering** of state slices with individual sub-states
- and to have a **centralized place** to store them.

## Example

We are going to fetch some movie data from a server and use `redux-ops` on a side to have more control of the states of our request by applying the provided custom middleware.

### Pre/Initial Setup

```js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import opsReducer, { middleware } from 'redux-ops';

// Set up reducer and apply middleware
const store = createStore(
  combineReducers({ ops: opsReducer },
  applyMiddleware(middleware))
);
```

While it's not required to use the middleware (see low-level API), it enables the usage of `redux-ops`' action blueprints to reduce boilerplate by either using already defined action creators
like the ones below, or by soley relying on the operations themselves.

```js
// These action creators might already exist in our app
function fetchMovies() {
  return {
    type: 'FETCH_MOVIES',
  };
}

function didFetchMovies(movies) {
  return {
    type: 'FETCH_MOVIES_SUCCESS',
    payload: { movies },
  };
}
```

The `blueprint` function simply wraps our action creators into actions that will then be handled by the middleware.

Since we already have two designated creators to initiate (`fetchMovies`) and complete (`didFetchMovies`) the operation, we can leverage them, or let the auto-generated action creators handle non-defined cases such as the `error` one, which we haven't defined.

```js
import { blueprint } from 'redux-ops';

// Create a with blueprints enhanced fetcher object
const movieFetcher = blueprint('FETCH_MOVIES', {
  start: fetchMovies,
  success: didFetchMovies,
});
```

In order to kick-off the operation, we need to dispatch the `movieFetcher.start()` action.

```js
dispatch(movieFetcher.start());
```

This will, on the one hand, start a new `op` state with the id `FETCH_MOVIES` (_which can be chosen arbitrarily and is not directly related to existing types_), and furthermore, dispatch the original `fetchMovies()` action through the middleware.

The request itself can then be sent in whatever way. Note that we are dispatching `movieFetcher.error(...)` here. Because we didn't define our own action creator, the error state will be only handled by the `ops`-reducer.

```js
// Fetch movies and update the previously started operation
fetch('https://example.com/movies.json')
  .then(response => response.json())
  .then(movies => dispatch(movieFetcher.success(movies)))
  .catch(error => dispatch(movieFetcher.error(error.message));
```

A set of selectors and utility functions allows to, for example, retrieve the current state of an operation, or clean it up when it's no longer needed.

```js
// Get the operation state by using one of the available selectors
console.log(movieFetcher.get(store.getState()));

// Delete the operation if needed
dispatch(movieFetcher.delete());
```

[Live Demo](https://codesandbox.io/s/sharp-buck-120j0)

### Op Data

If the movie request was successful, the selector [`getOpById`](#getOpById) returns the operation, which is an `object` consisting of `id`, `status` and `data`.

```js
{
  id: '74168d',
  status: 'success',
  data: [
    { "id": 1, "name": "The Dark Knight" },
    { "id": 2, "name": "Jurassic World" },
    { "id": 3, "name": "Avatar" }
  ],
}
```

### Examples with Middlewares

Here are two more examples of how `redux-ops` looks in combination with middlewares like `redux-thunk` or `redux-saga`.

#### redux-thunk

```js
function fetchMovies(opId) {
  return async dispatch => {
    const op = new Op(opId);
    dispatch(op.start(OpStatus.Loading));

    try {
      const response = await fetch('https://example.com/movies.json');
      const data = await response.json();
      dispatch(op.update(OpStatus.Success, data));
    } catch (error) {
      dispatch(op.update(OpStatus.Error, error.message));
    }
  };
}
```

#### redux-saga

```js
function* fetchMovies(opId) {
  const op = new Op(opId);
  yield put(op.start(OpStatus.Loading));

  try {
    const response = yield call(fetch, 'https://example.com/movies.json');
    const data = yield call(response.json);
    yield put(op.update(OpStatus.Success, data));
  } catch (error) {
    yield put(op.update(OpStatus.Error, error.message));
  }
}
```

## Documentation

- [Actions](docs/Actions.md)
- [Selectors](docs/Selectors.md)
- [Utility](docs/Utility.md)

## License

MIT

[npm]: https://img.shields.io/npm/v/redux-ops.svg
[npm-url]: https://npmjs.com/package/redux-ops
