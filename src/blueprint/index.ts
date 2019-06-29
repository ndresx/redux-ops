import { compose } from 'redux';
import * as actions from '../actions';
import * as actionTypes from '../action_types';
import {
  OpsBlueprintOriginalAction,
  OpsBlueprintAction,
  OpsBlueprint,
  BlueprintActionComposers,
  OpsBlueprintActionCreator,
  OpsBlueprintActionTypes,
  ComposedActionCreator,
  OpsBlueprintActionKey,
} from './typedefs';
import { OperationAction, DeleteOperationAction, OpId, OpStatus } from '../typedefs';

let uniqueCounter = 0;

export function createBlueprintAction(
  op: OperationAction | DeleteOperationAction,
  action?: OpsBlueprintOriginalAction | null
): OpsBlueprintAction {
  return {
    type: actionTypes.BLUEPRINT,
    [actionTypes.prefix]: { op, action },
  };
}

export function composeBlueprint<T extends OpsBlueprint>(
  blueprint: OpsBlueprint,
  composer: Function
): T {
  return {
    ...blueprint,
    ...Object.keys(OpsBlueprintActionKey).reduce(
      (acc, value) => {
        const key = OpsBlueprintActionKey[value];
        acc[key] = compose(
          composer,
          blueprint[key]
        );
        return acc;
      },
      {} as T
    ),
  };
}

function composeActions(
  blueprintActionCreator: OpsBlueprintActionCreator,
  actionCreator?: Function
): ComposedActionCreator {
  return actionCreator
    ? compose(
        (action, data) => blueprintActionCreator(data, action),
        actionCreator
      )
    : (data, action) => blueprintActionCreator(data, action);
}

function createStartAction(id: OpId): OpsBlueprintActionCreator {
  return (data, action) =>
    createBlueprintAction(actions.startOperation(id, OpStatus.Started, data), action);
}

function createUpdateAction(id: OpId, opStatus: OpStatus): OpsBlueprintActionCreator {
  return (data, action) =>
    createBlueprintAction(actions.updateOperation(id, opStatus, data), action);
}

function createDeleteAction(id: OpId): OpsBlueprintActionCreator {
  return action => createBlueprintAction(actions.deleteOperation(id), action);
}

export function createBlueprint<T extends OpsBlueprint>(
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

export function createBlueprintActionTypes(id: OpId): OpsBlueprintActionTypes {
  return Object.keys(OpStatus).reduce(
    (acc, value) => {
      const key = value.toUpperCase();
      acc[key] = `${String(id)}_${key}`;
      return acc;
    },
    {} as OpsBlueprintActionTypes
  );
}

export function opsUnique<T extends OpsBlueprint | OpsBlueprintAction>(
  blueprint: T,
  uniqueValue?: OpsBlueprintAction | OpId
): T {
  if (blueprint[actionTypes.prefix]) {
    const opsData = blueprint[actionTypes.prefix];
    const uniqueId = generateUniqueId(opsData.op.payload.id, uniqueValue);

    if (opsData.action) {
      opsData.action[actionTypes.prefix] = { uniqueId };
    }

    blueprint[actionTypes.prefix].uniqueId = uniqueId;

    return blueprint;
  }

  const uniqueId = generateUniqueId((blueprint as OpsBlueprint).id, uniqueValue);
  return composeBlueprint<T extends OpsBlueprint ? T : any>(
    blueprint as any,
    (action: OpsBlueprintAction): OpsBlueprintAction => opsUnique(action, uniqueId)
  );
}

function generateUniqueId(id: OpId, uniqueValue?: OpsBlueprintAction | OpId): OpId {
  return uniqueValue
    ? typeof uniqueValue === 'object'
      ? getUniqueId(uniqueValue)
      : (uniqueValue as any)
    : `${actionTypes.prefix}${id}_${++uniqueCounter}`;
}

export function opsBroadcast<T extends OpsBlueprint | OpsBlueprintAction>(blueprint: T): T {
  if (blueprint[actionTypes.prefix]) {
    blueprint[actionTypes.prefix].broadcast = true;
    return blueprint;
  }

  return composeBlueprint<T extends OpsBlueprint ? T : any>(blueprint as any, opsBroadcast);
}

export function getUniqueId(action: OpsBlueprintOriginalAction): OpId | undefined {
  const opsData = action[actionTypes.prefix];
  return opsData && opsData.uniqueId;
}
