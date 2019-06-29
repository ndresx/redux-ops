import { AnyAction } from 'redux';

import * as actionTypes from '../action_types';
import { OperationAction, DeleteOperationAction, OpId } from '../typedefs';

export enum BlueprintActionKey {
  Start = 'start',
  Success = 'success',
  Error = 'error',
  Delete = 'delete',
}

export type BlueprintActionTypes = {
  readonly STARTED: string;
  readonly INTERMEDIATE: string;
  readonly SUCCESS: string;
  readonly ERROR: string;
};

export interface OpBlueprintAction {
  readonly type: string;
  [actionTypes.prefix]: OpsData;
}

export interface OpsData extends OpsGenericActionData {
  op: OperationAction | DeleteOperationAction;
  action?: OpBlueprintOriginalAction | null;
}

export interface OpsGenericActionData {
  uniqueId?: OpId;
  broadcast?: boolean;
}

export interface OpBlueprintOriginalAction extends AnyAction {
  [actionTypes.prefix]?: OpsGenericActionData;
}

export interface BlueprintActionCreator {
  (data?: any, action?: OpBlueprintOriginalAction | null): OpBlueprintAction;
}

type OpBlueprintActionCreator = (...args: any[]) => any;

export type BlueprintActionComposers = { [key in BlueprintActionKey]?: OpBlueprintActionCreator };

export type ComposedActionCreator = BlueprintActionCreator | OpBlueprintActionCreator;

export type OpBlueprint = { [key in BlueprintActionKey]: ComposedActionCreator } & {
  readonly id: OpId;
};

export type OpBlueprintFn<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => OpBlueprintAction;
