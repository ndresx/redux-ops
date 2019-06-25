import { compose } from 'redux';
import * as actions from '../actions';
import * as actionTypes from '../action_types';
import * as selectors from '../selectors';
import {
  OpBlueprintOriginalAction,
  OpBlueprintAction,
  OpBlueprint,
  BlueprintComposers,
  BlueprintPrepareFn,
} from './typedefs';
import { OperationAction, DeleteOperationAction, OpId, OpStatus } from '../typedefs';

let uniqueCounter = 0;

function prepare(
  op: OperationAction | DeleteOperationAction,
  action?: OpBlueprintOriginalAction | null
): OpBlueprintAction {
  return {
    type: actionTypes.BLUEPRINT,
    [actionTypes.prefix]: { op, action },
  };
}

function composeBlueprint(prepare: BlueprintPrepareFn, composer?: Function) {
  return composer
    ? compose(
        prepare,
        composer
      )
    : prepare;
}

export function blueprint<T extends OpBlueprint>(
  actionType: string,
  composers: BlueprintComposers = {}
): T {
  const start: BlueprintPrepareFn = (action, data) =>
    prepare(actions.startOperation(actionType, OpStatus.Started, data), action);
  const update = (opStatus: OpStatus): BlueprintPrepareFn => (action, data) =>
    prepare(actions.updateOperation(actionType, opStatus, data), action);

  return {
    start: composeBlueprint(start, composers.start),
    success: composeBlueprint(update(OpStatus.Success), composers.success),
    error: composeBlueprint(update(OpStatus.Error), composers.error),
    delete: composeBlueprint(() => prepare(actions.deleteOperation(actionType)), composers.delete),
    get: (state: unknown) => selectors.getOpById(state, actionType),
  } as T;
}

export function uniqueOp(
  action: OpBlueprintAction,
  uniqueOpAction?: OpBlueprintOriginalAction
): OpBlueprintAction {
  const opsData = action[actionTypes.prefix];
  const uniqueId = uniqueOpAction
    ? getUniqueId(uniqueOpAction)
    : `${opsData.op.payload.id}_${++uniqueCounter}`;

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
