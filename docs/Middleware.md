# Middleware

The `opsMiddleware` enables the usage of `redux-ops` [Blueprints](Blueprints.md) to reduce boilerplate by either using already defined action creators or by relying on the built-in Operations.

## Setup

```js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import opsReducer, { middleware } from 'redux-ops';

// Set up reducer and apply the middleware
const store = createStore(
  combineReducers({ ops: opsReducer },
  applyMiddleware(middleware)
);
```

Read more about [Blueprints](Blueprints.md).
