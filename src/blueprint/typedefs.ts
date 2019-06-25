import { AnyAction } from 'redux';

import * as actionTypes from '../action_types';
import * as selectors from '../selectors';
import { OperationAction, DeleteOperationAction, OpId } from '../typedefs';

export interface OpsData extends OpsOriginalActionData {
  op: OperationAction | DeleteOperationAction;
  action?: OpBlueprintOriginalAction | null;
}

export interface OpsOriginalActionData {
  uniqueId?: OpId;
  broadcast?: boolean;
}

export interface OpBlueprintAction {
  readonly type: string;
  [actionTypes.prefix]: OpsData;
}

export interface OpBlueprintOriginalAction extends AnyAction {
  [actionTypes.prefix]?: OpsOriginalActionData;
}

export interface BlueprintPrepareFn {
  (action?: OpBlueprintOriginalAction | null, data?: any): OpBlueprintAction;
}

enum BlueprintActionKey {
  Start = 'start',
  Success = 'success',
  Error = 'error',
  Delete = 'delete',
}

export type BlueprintComposers = { [key in BlueprintActionKey]?: Function } & {
  unique?: boolean;
};

export type OpBlueprint = { [key in BlueprintActionKey]: BlueprintPrepareFn | Function } & {
  readonly get: (state: unknown) => ReturnType<typeof selectors.getOpById>;
};

export type OpBlueprintFn<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => OpBlueprintAction;
