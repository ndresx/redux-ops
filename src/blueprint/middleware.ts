import { Middleware } from 'redux';

import * as actionTypes from '../action_types';
import { OpStatus } from '../typedefs';
import { OpsData, OpBlueprintOriginalAction } from './typedefs';

function createOpsMiddleware(): Middleware {
  return ({ dispatch }) => next => action => {
    if (action[actionTypes.prefix]) {
      const blueprintAction: OpsData = action[actionTypes.prefix];

      if (!blueprintAction) {
        return next(action);
      }

      let opAction = blueprintAction.op;
      const opActionPayload = opAction.payload;
      const opActionId = opActionPayload.id;
      let opStatus: OpStatus | undefined;
      let broadcastAction: OpBlueprintOriginalAction | undefined = undefined;

      // Create a custom action based on the operation's status
      if ('status' in opActionPayload) {
        opStatus = opActionPayload.status;

        if (blueprintAction.broadcast) {
          broadcastAction = {
            type: `${opActionId}_${opStatus.toUpperCase()}`,
            payload: opActionPayload.data,
            [actionTypes.prefix]: undefined,
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
        const originalAction = blueprintAction.action;

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
