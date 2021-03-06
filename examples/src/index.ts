import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import opsReducer, { opsMiddleware } from 'redux-ops';
import { movieFetcher } from './actions';

// Create store and set up reducer(s)
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers({ ops: opsReducer }),
  composeEnhancers(applyMiddleware(opsMiddleware))
);

// Get store dispatch
const dispatch = store.dispatch;

(async function() {
  dispatch(movieFetcher.start('Science-Fiction'));

  await fetch('https://my-json-server.typicode.com/ndresx/redux-ops/movies')
    .then(response => response.json())
    .then(data => dispatch(movieFetcher.success(data)))
    .catch(error => dispatch(movieFetcher.error(error.message)));

  dispatch(movieFetcher.delete());
})();
