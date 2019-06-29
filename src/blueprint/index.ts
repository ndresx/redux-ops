import { compose } from 'redux';
import * as actions from '../actions';
import * as actionTypes from '../action_types';
import {
  OpBlueprintOriginalAction,
  OpBlueprintAction,
  OpBlueprint,
  BlueprintActionComposers,
  BlueprintActionCreator,
  BlueprintActionTypes,
  ComposedActionCreator,
  BlueprintActionKey,
} from './typedefs';
import { OperationAction, DeleteOperationAction, OpId, OpStatus } from '../typedefs';

let uniqueCounter = 0;

export function createBlueprintAction(
  op: OperationAction | DeleteOperationAction,
  action?: OpBlueprintOriginalAction | null
): OpBlueprintAction {
  return {
    type: actionTypes.BLUEPRINT,
    [actionTypes.prefix]: { op, action },
  };
}

export function composeBlueprint<T extends OpBlueprint>(
  blueprint: OpBlueprint,
  composer: Function
): T {
  return Object.keys(BlueprintActionKey).reduce(
    (acc, value) => {
      const key = BlueprintActionKey[value];
      acc[key] = compose(
        composer,
        blueprint[key]
      );
      return acc;
    },
    {} as T
  );
}

function composeActions(
  blueprintActionCreator: BlueprintActionCreator,
  actionCreator?: Function
): ComposedActionCreator {
  return actionCreator
    ? compose(
        (action, data) => blueprintActionCreator(data, action),
        actionCreator
      )
    : (data, action) => blueprintActionCreator(data, action);
}

function createStartAction(id: OpId): BlueprintActionCreator {
  return (data, action) =>
    createBlueprintAction(actions.startOperation(id, OpStatus.Started, data), action);
}

function createUpdateAction(id: OpId, opStatus: OpStatus): BlueprintActionCreator {
  return (data, action) =>
    createBlueprintAction(actions.updateOperation(id, opStatus, data), action);
}

function createDeleteAction(id: OpId): BlueprintActionCreator {
  return action => createBlueprintAction(actions.deleteOperation(id), action);
}

export function createBlueprint<T extends OpBlueprint>(
  id: OpId,
  composers: BlueprintActionComposers = {}
): T {
  return {
    id,
    start: composeActions(createStartAction(id), composers.start),
    success: composeActions(createUpdateAction(id, OpStatus.Success), composers.success),
    error: composeActions(createUpdateAction(id, OpStatus.Error), composers.error),
    delete: composeActions(createDeleteAction(id), composers.delete),
  } as T;
}

export function createBlueprintActionTypes(id: OpId): BlueprintActionTypes {
  return Object.keys(OpStatus).reduce(
    (acc, value) => {
      const key = value.toUpperCase();
      acc[key] = `${String(id)}_${key}`;
      return acc;
    },
    {} as BlueprintActionTypes
  );
}

export function opsUnique<T extends OpBlueprint | OpBlueprintAction>(
  op: T,
  uniqueValue?: OpBlueprintAction | OpId
): T {
  if (op[actionTypes.prefix]) {
    const opsData = op[actionTypes.prefix];
    const uniqueId = generateUniqueId(opsData.op.payload.id, uniqueValue);

    if (opsData.action) {
      opsData.action[actionTypes.prefix] = { uniqueId };
    }

    op[actionTypes.prefix].uniqueId = uniqueId;

    return op;
  }

  const uniqueId = generateUniqueId((op as OpBlueprint).id, uniqueValue);
  return composeBlueprint<T extends OpBlueprint ? T : any>(
    op as any,
    (action: OpBlueprintAction): OpBlueprintAction => opsUnique(action, uniqueId)
  );
}

function generateUniqueId(id: OpId, uniqueValue?: OpBlueprintAction | OpId): OpId {
  return uniqueValue
    ? typeof uniqueValue === 'object'
      ? getUniqueId(uniqueValue)
      : (uniqueValue as any)
    : `${actionTypes.prefix}${id}_${++uniqueCounter}`;
}

export function opsBroadcast<T extends OpBlueprint | OpBlueprintAction>(op: T): T {
  if (op[actionTypes.prefix]) {
    op[actionTypes.prefix].broadcast = true;
    return op;
  }

  return composeBlueprint<T extends OpBlueprint ? T : any>(op as any, opsBroadcast);
}

export function getUniqueId(action: OpBlueprintOriginalAction): OpId | undefined {
  const opsData = action[actionTypes.prefix];
  return opsData && opsData.uniqueId;
}
