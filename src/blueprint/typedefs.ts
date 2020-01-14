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
  readonly START: string;
  readonly SUCCESS: string;
  readonly ERROR: string;
  readonly DELETE: string;
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

export type OpsBlueprintActionDataEntry = { [actionTypes.prefix]?: OpsBlueprintGenericActionData };

export interface OpsBlueprintBroadcastAction<TData = any>
  extends OperationAction<TData>,
    OpsBlueprintActionDataEntry {}

export type OpsBlueprintOriginalAction<T extends {} = AnyAction> = T & OpsBlueprintActionDataEntry;

export interface OpsBlueprintActionCreator {
  (data?: any, action?: OpsBlueprintOriginalAction | null): OpsBlueprintAction;
}

type OpsBlueprintAnyActionCreator = (data?: any) => any;

export type OpsBlueprintActionComposers = {
  [key in OpsBlueprintActionKey]?: OpsBlueprintAnyActionCreator;
};

export type OpsBlueprintComposedActionCreator =
  | OpsBlueprintActionCreator
  | OpsBlueprintAnyActionCreator;

type OpsBlueprintActionCreators = {
  [key in Exclude<OpsBlueprintActionKey, OpsBlueprintActionKey.Delete>]: (
    data?: any
  ) => OpsBlueprintAction;
} & {
  readonly delete: () => OpsBlueprintAction;
};

export type OpsBlueprint = {
  readonly id: OpId;
} & OpsBlueprintActionCreators &
  OpsBlueprintActionTypes;

export type OpsBlueprintFn<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => OpsBlueprintAction;
