# Selectors

The following selectors can be used to obtain data from the `redux-ops` state slice. Some of them are also available as [utility](utility.md) functions.

## `getOpsState(state)`

Returns the entire state of the `redux-ops` state slice.

## `getOps(state)`

Returns all stored operations as key/value pair.

## `getOpById(state, id)`

Returns the operation that matches a given `id`.
Returns `undefined` if no matching operation can be found.

Also available as [utility](utility.md#getOpById-state--id-) function.

## `getOpByIds(state, ids)`

Returns operations that match a given array of `ids`. Returns an empty `object` if no matching operations can be found.

Also available as [utility](utility.md#getOpByIds-state--ids-) function.

## `searchOps(state, query)`

Returns operations that match a given `query` in `string`/`RegEx` format. Returns an empty `object` if no matching operations can be found.

Also available as [utility](utility.md#searchOps-state--query-) function.

## `setReducerName(state, name)`

Allows setting a custom reducer name which, otherwise, defaults to the name `ops`.
