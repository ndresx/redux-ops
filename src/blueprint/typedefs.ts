import { AnyAction } from 'redux';

import * as actionTypes from '../action_types';
import { OperationAction, DeleteOperationAction, OpId } from '../typedefs';

export enum OpsBlueprintActionKey {
  Start = 'start',
  Success = 'success',
  Error = 'error',
  Delete = 'delete',
}

export type OpsBlueprintActionTypes = {
  readonly STARTED: string;
  readonly INTERMEDIATE: string;
  readonly SUCCESS: string;
  readonly ERROR: string;
};

export interface OpsBlueprintAction {
  readonly type: string;
  [actionTypes.prefix]: OpsBlueprintActionData;
}

export interface OpsBlueprintActionData extends OpsBlueprintGenericActionData {
  op: OperationAction | DeleteOperationAction;
  action?: OpsBlueprintOriginalAction | null;
}

export interface OpsBlueprintGenericActionData {
  uniqueId?: OpId;
  broadcast?: boolean;
}

export interface OpsBlueprintOriginalAction extends AnyAction {
  [actionTypes.prefix]?: OpsBlueprintGenericActionData;
}

export interface OpsBlueprintActionCreator {
  (data?: any, action?: OpsBlueprintOriginalAction | null): OpsBlueprintAction;
}

type OpsOpsBlueprintActionCreator = (...args: any[]) => any;

export type BlueprintActionComposers = {
  [key in OpsBlueprintActionKey]?: OpsOpsBlueprintActionCreator;
};

export type ComposedActionCreator = OpsBlueprintActionCreator | OpsOpsBlueprintActionCreator;

export type OpsBlueprint = { [key in OpsBlueprintActionKey]: ComposedActionCreator } & {
  readonly id: OpId;
};

export type OpsBlueprintFn<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => OpsBlueprintAction;
