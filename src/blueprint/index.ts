import { compose } from 'redux';
import * as actions from '../actions';
import * as actionTypes from '../action_types';
import {
  OpBlueprintOriginalAction,
  OpBlueprintAction,
  OpBlueprint,
  BlueprintComposers,
  BlueprintActionCreatorFn,
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

function composeActions(createBlueprintAction: BlueprintActionCreatorFn, composer?: Function) {
  return composer
    ? compose(
        createBlueprintAction,
        composer
      )
    : createBlueprintAction;
}

function generateActionTypes(opId: OpId): OpBlueprint['actionTypes'] {
  return Object.keys(OpStatus).reduce(
    (acc, value) => {
      const key = value.toUpperCase();
      acc[key] = `${String(opId)}_${key}`;
      return acc;
    },
    {} as any
  );
}

function createStartAction(opId: OpId): BlueprintActionCreatorFn {
  return (action, data) =>
    createBlueprintAction(actions.startOperation(opId, OpStatus.Started, data), action);
}

function createUpdateAction(opId: OpId, opStatus: OpStatus): BlueprintActionCreatorFn {
  return (action, data) =>
    createBlueprintAction(actions.updateOperation(opId, opStatus, data), action);
}

function createDeleteAction(opId: OpId): BlueprintActionCreatorFn {
  return action => createBlueprintAction(actions.deleteOperation(opId), action);
}

export function createBlueprint<T extends OpBlueprint>(
  opId: OpId,
  composers: BlueprintComposers = {}
): T {
  return {
    start: composeActions(createStartAction(opId), composers.start),
    success: composeActions(createUpdateAction(opId, OpStatus.Success), composers.success),
    error: composeActions(createUpdateAction(opId, OpStatus.Error), composers.error),
    delete: composeActions(createDeleteAction(opId), composers.delete),
    actionTypes: generateActionTypes(opId),
  } as T;
}

export function uniqueOp(
  action: OpBlueprintAction,
  uniqueOpAction?: OpBlueprintOriginalAction | OpId
): OpBlueprintAction {
  const opsData = action[actionTypes.prefix];
  const uniqueId = uniqueOpAction
    ? typeof uniqueOpAction === 'number' || typeof uniqueOpAction === 'string'
      ? uniqueOpAction
      : getUniqueId(uniqueOpAction)
    : `${actionTypes.prefix}_${++uniqueCounter}`;

  if (opsData.action) {
    opsData.action[actionTypes.prefix] = { uniqueId };
  }

  action[actionTypes.prefix].uniqueId = uniqueId;

  return action;
}

export function broadcastOp(action: OpBlueprintAction): OpBlueprintAction {
  action[actionTypes.prefix].broadcast = true;
  return action;
}

export function getUniqueId(action: OpBlueprintOriginalAction): OpId | undefined {
  const opsData = action[actionTypes.prefix];
  return opsData && opsData.uniqueId;
}
