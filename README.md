# redux-ops [![npm][npm]][npm-url] [![Build Status](https://travis-ci.org/ndresx/redux-ops.svg?branch=master)](https://travis-ci.org/ndresx/redux-ops) [![Coverage Status](https://coveralls.io/repos/github/ndresx/redux-ops/badge.svg?branch=master)](https://coveralls.io/github/ndresx/redux-ops?branch=master)

A Redux reducer for persisting asynchronous and operational states.

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

`redux-ops` is trying to take this concern away by providing an `ops`-reducer, actions and selectors to

- **maintain** aforementioned states in a more consistent way (e.g. requests),
- **communicate** whether something was successful or not,
- **prevent cluttering** of state slices with individual sub-states
- and to have a **centralized place** to store them.

## Example

The most common use case is probably async request state handling.

```js
import { createStore, combineReducers } from 'redux';
import opsReducer, { actions, selectors } from 'redux-ops';

// Create store and set up reducer(s)
const store = createStore(combineReducers({ ops: opsReducer }));
```

```js
// Create an operation in its default state
const op = new Op('74168d');
dispatch(op.create(OpStatus.Loading));
```

```js
// Fetch movies and update the previously created operation
fetch('https://example.com/movies.json')
  .then(response => response.json())
  .then(movies => dispatch(op.update(OpStatus.Success, movies)))
  .catch(error => dispatch(op.update(OpStatus.Error, error.message)));
```

```js
// Get the operation state by using one of the provided selectors
console.log(selectors.getOpById(store.getState(), op.getId()));

// Delete the operation if needed
dispatch(op.delete());
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
    dispatch(op.create(OpStatus.Loading));

    try {
      const response = await fetch('https://example.com/movies.json');
      const data = await response.json();
      dispatch(op.update(OpStatus.Success, data));
    }
    catch(error) {
      dispatch(op.update(OpStatus.Error, error.message));
    }
  }
}
```

#### redux-saga

```js
function* fetchMovies(opId) {
  const op = new Op(opId);
  yield put(op.create(OpStatus.Loading));

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
