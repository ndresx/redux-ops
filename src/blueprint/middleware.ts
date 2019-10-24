import { Middleware } from 'redux';

import * as actionTypes from '../action_types';
import { OpStatus, Operation } from '../typedefs';
import { OpsBlueprintActionData, OpsBlueprintOriginalAction } from './typedefs';

function createOpsMiddleware(): Middleware {
  return store => next => action => {
    if (action[actionTypes.prefix]) {
      const blueprintAction: OpsBlueprintActionData = action[actionTypes.prefix];
      let opAction = blueprintAction.op;
      const opActionPayload = opAction.payload;
      const originalAction = blueprintAction.action;
      const opStatus = 'status' in opActionPayload ? opActionPayload.status : undefined;
      let broadcastAction: OpsBlueprintOriginalAction | undefined = undefined;

      if (blueprintAction.broadcast) {
        let broadcastActionType = opAction.type;

        if (opStatus && broadcastActionType === actionTypes.UPDATE) {
          broadcastActionType = opStatus.toUpperCase();
        } else {
          broadcastActionType = broadcastActionType.replace(actionTypes.prefix, '');
        }

        broadcastAction = {
          type: `${opActionPayload.id}_${broadcastActionType}`,
          payload: { ...opActionPayload },
        };
      }

      // Create a custom action based on the operation's status
      if (opStatus) {
        if (blueprintAction.broadcast) {
          opAction = {
            ...opAction,
            payload: {
              ...opAction.payload,
              data: undefined,
            } as Operation<any>,
          };
        }
      }

      // Exchange original op action id with unique id
      if (blueprintAction.uniqueId) {
        const { uniqueId } = blueprintAction;

        opAction = {
          ...opAction,
          payload: {
            ...opActionPayload,
            id: uniqueId,
          },
        };

        if (broadcastAction) {
          broadcastAction[actionTypes.prefix] = { uniqueId };
        }
      }

      switch (opStatus) {
        case OpStatus.Started: {
          next(opAction);
          originalAction && next(originalAction);
          broadcastAction && next(broadcastAction);
          return;
        }
        default: {
          originalAction && next(originalAction);
          broadcastAction && next(broadcastAction);
          return next(opAction);
        }
      }
    }

    return next(action);
  };
}

export default createOpsMiddleware();
