import { AnyAction } from 'redux';

import * as actionTypes from '../action_types';
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

export interface BlueprintActionCreatorFn {
  (action?: OpBlueprintOriginalAction | null, data?: any): OpBlueprintAction;
}

export enum BlueprintActionKey {
  Start = 'start',
  Success = 'success',
  Error = 'error',
  Delete = 'delete',
}

type BlueprintActionTypes = {
  readonly STARTED: string;
  readonly INTERMEDIATE: string;
  readonly SUCCESS: string;
  readonly ERROR: string;
};

export type BlueprintComposers = { [key in BlueprintActionKey]?: Function };

export type OpBlueprint = { [key in BlueprintActionKey]: BlueprintActionCreatorFn | Function } & {
  readonly actionTypes: BlueprintActionTypes;
};

export type OpBlueprintFn<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => OpBlueprintAction;
