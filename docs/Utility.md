# Utility

## `createOperation(id, [status, data])`

Can be used to generate an `op` object, consisting of `id`, `status` and a `data` property.

```ts
createOperation('myId', OpStatus.Started, { name: 'Endgame' });
// { id: 'myId', status: 'started', data: { name: 'Endgame' }}
```

## `getOpById(ops, id)`

Returns the Operation that matches a given `id` in the provided `ops` object.
Returns `undefined` if no matching Operation can be found.

## `getOpByIds(ops, ids)`

Returns Operations that match a given array of `ids` in the provided `ops` object. Returns an empty `object` if no matching Operations can be found.

## `searchOps(ops, query)`

Returns Operations that match a given `query` in `string`/`RegEx` format in the provided `ops` object. Returns an empty `object` if no matching Operations can be found.
