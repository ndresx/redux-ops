# redux-ops [![npm][npm]][npm-url] [![Build Status](https://travis-ci.org/ndresx/redux-ops.svg?branch=master)](https://travis-ci.org/ndresx/redux-ops) [![Coverage Status](https://coveralls.io/repos/github/ndresx/redux-ops/badge.svg?branch=master)](https://coveralls.io/github/ndresx/redux-ops?branch=master)

A Redux reducer for persisting asynchronous and operational states.

- [Getting Started](#getting-started)
- [Motivation](#motivation)
- [Example](#example)
- [API Reference](#api-reference)
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

Maintaining asynchronous and operational states is an integral component of almost every modern app, but still an often discussed topic when it comes to structuring your Redux store state accordingly.

`redux-ops` is trying to take this concern away by providing an `ops`-reducer, actions and selectors in order to

- maintain aforementioned states in a consistent way (e.g. requests),
- communicate directly whether something was successful or not,
- prevent cluttering state slices with individual state keys
- and to have a centralized place to store them.

## Example

The most common use case is probably async request state handling. 

```js
import { createStore, combineReducers } from 'redux';
import opsReducer, { actions, selectors } from 'redux-ops';

// Create store and set up reducer(s)
const store = createStore(combineReducers({ ops: opsReducer }));

// Generate an id (string or number)
const opId = '74168d';

// Create an operation in its default state
dispatch(actions.createOperation(opId));

// Fetch movies and update the previously created operation
fetch('http://example.com/movies.json')
  .then(response => response.json())
  .then(movies => dispatch(actions.updateOperation(opId, OperationStatus.Success, movies)))
  .catch(err => dispatch(actions.updateOperation(opId, OperationStatus.Error, err.message)));

// Get the operation state by one of the available selectors
console.log(selectors.getOpById(store.getState(), opId));
```

If the movie request was successful, the selector `getOpById` returns the operation, which is an `object` consisting of `id`, `status` and `data`.

```js
{
  id: '74168d',
  status: 'success',
  data: [{ name: 'The Dark Knight' }, { name: 'Jurassic World' }],
}
```

## API Reference

**WIP**

## License

MIT

[npm]: https://img.shields.io/npm/v/redux-ops.svg
[npm-url]: https://npmjs.com/package/redux-ops
