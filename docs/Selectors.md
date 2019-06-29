# Selectors

The following selectors can be used to obtain data from the `redux-ops` state slice. Some of them are also available as [utility](Utility.md) functions.

## `getOpsState(state)`

Returns the entire state of the `redux-ops` state slice.

## `getOps(state)`

Returns all stored Operations as key/value pair.

## `getOpById(state, id)`

Returns the Operation that matches a given `id`.
Returns `undefined` if no matching Operation are found.

Also available as [utility](Utility.md#getopbyidops-id) function.

## `getOpByIds(state, ids)`

Returns Operations that match a given array of `ids`. Returns an empty `object` if no matching Operations are found.

Also available as [utility](Utility.md#getopbyidsops-ids) function.

## `searchOps(state, query)`

Returns Operations that match a given `query` in `string`/`RegEx` format. Returns an empty `object` if no matching Operations are found.

Also available as [utility](Utility.md#searchopsops-query) function.

## `setReducerName(state, name)`

Allows setting a custom reducer name which, otherwise, defaults to the name `ops`.
