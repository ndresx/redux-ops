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
      const opActionId = opActionPayload.id;
      const originalAction = blueprintAction.action;
      let opStatus: OpStatus | undefined;
      let broadcastAction: OpsBlueprintOriginalAction | undefined = undefined;

      // Create a custom action based on the operation's status
      if ('status' in opActionPayload) {
        opStatus = opActionPayload.status;

        if (blueprintAction.broadcast) {
          broadcastAction = {
            type: `${opActionId}_${opStatus.toUpperCase()}`,
            payload: opActionPayload,
            [actionTypes.prefix]: undefined,
          };

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

      if (opStatus) {
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

      return next(opAction);
    }

    return next(action);
  };
}

export default createOpsMiddleware();
