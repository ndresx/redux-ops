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
  ComposedBlueprintAction,
  BlueprintActionKey,
} from './typedefs';
import { OperationAction, DeleteOperationAction, OpId, OpStatus } from '../typedefs';

let uniqueCounter = 0;

function createBlueprintAction(
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
): ComposedBlueprintAction {
  return actionCreator
    ? compose(
        blueprintActionCreator,
        actionCreator
      )
    : blueprintActionCreator;
}

function createStartAction(opId: OpId): BlueprintActionCreator {
  return (action, data) =>
    createBlueprintAction(actions.startOperation(opId, OpStatus.Started, data), action);
}

function createUpdateAction(opId: OpId, opStatus: OpStatus): BlueprintActionCreator {
  return (action, data) =>
    createBlueprintAction(actions.updateOperation(opId, opStatus, data), action);
}

function createDeleteAction(opId: OpId): BlueprintActionCreator {
  return action => createBlueprintAction(actions.deleteOperation(opId), action);
}

export function createBlueprint<T extends OpBlueprint>(
  opId: OpId,
  composers: BlueprintActionComposers = {}
): T {
  return {
    start: composeActions(createStartAction(opId), composers.start),
    success: composeActions(createUpdateAction(opId, OpStatus.Success), composers.success),
    error: composeActions(createUpdateAction(opId, OpStatus.Error), composers.error),
    delete: composeActions(createDeleteAction(opId), composers.delete),
  } as T;
}

export function createBlueprintActionTypes(opId: OpId): BlueprintActionTypes {
  return Object.keys(OpStatus).reduce(
    (acc, value) => {
      const key = value.toUpperCase();
      acc[key] = `${String(opId)}_${key}`;
      return acc;
    },
    {} as BlueprintActionTypes
  );
}

export function opUnique(
  action: OpBlueprintAction,
  uniqueValue?: OpBlueprintAction | OpId
): OpBlueprintAction {
  const opsData = action[actionTypes.prefix];
  const uniqueId = uniqueValue
    ? typeof uniqueValue === 'object'
      ? getUniqueId(uniqueValue)
      : uniqueValue
    : generateUniqueId();

  if (opsData.action) {
    opsData.action[actionTypes.prefix] = { uniqueId };
  }

  action[actionTypes.prefix].uniqueId = uniqueId;

  return action;
}

export function opsUnique<T extends OpBlueprint>(
  blueprint: OpBlueprint,
  uniqueValue?: OpBlueprintAction | OpId
): T {
  return composeBlueprint<T>(
    blueprint,
    (action: OpBlueprintAction): OpBlueprintAction => opUnique(action, uniqueValue)
  );
}

function generateUniqueId(): string {
  return `${actionTypes.prefix}${++uniqueCounter}`;
}

export function opBroadcast(action: OpBlueprintAction): OpBlueprintAction {
  action[actionTypes.prefix].broadcast = true;
  return action;
}

export function opsBroadcast<T extends OpBlueprint>(blueprint: OpBlueprint): T {
  return composeBlueprint<T>(blueprint, opBroadcast);
}

export function getUniqueId(action: OpBlueprintOriginalAction): OpId | undefined {
  const opsData = action[actionTypes.prefix];
  return opsData && opsData.uniqueId;
}
