# Actions

## `createOperation(id, [status, data])`

Creates the initial operation with `status` and `data` as optional arguments.

## `updateOperation(id, status, [data])`

Updates an operation with a new `status` and `data` as optional argument.

## `deleteOperation(id)`

Deletes one or multiple operation based on the given `id`s.

## `clearOperations()`

Clears the `ops`-reducer and effectively deletes all operations.
