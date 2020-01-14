import { Middleware } from 'redux';

import * as actionTypes from '../action_types';
import { OpStatus, Operation } from '../typedefs';
import { OpsBlueprintActionData, OpsBlueprintOriginalAction } from './typedefs';

function createOpsMiddleware(): Middleware {
  return ({ dispatch }) => next => action => {
    if (action[actionTypes.prefix]) {
      const blueprintAction: OpsBlueprintActionData = action[actionTypes.prefix];
      let opAction = blueprintAction.op;
      const originalAction = blueprintAction.action;
      const opStatus = 'status' in opAction.payload ? opAction.payload.status : undefined;
      let broadcastAction: OpsBlueprintOriginalAction | undefined = undefined;

      if (blueprintAction.broadcast) {
        let broadcastActionType = opAction.type;

        if (opStatus && broadcastActionType === actionTypes.UPDATE) {
          broadcastActionType = opStatus.toUpperCase();
        } else {
          broadcastActionType = broadcastActionType.replace(actionTypes.prefix, '');
        }

        broadcastAction = {
          type: `${opAction.payload.id}_${broadcastActionType}`,
          payload: { ...opAction.payload },
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
            ...opAction.payload,
            id: uniqueId,
          },
        };

        if (broadcastAction) {
          broadcastAction[actionTypes.prefix] = { uniqueId };
        }
      }

      switch (opStatus) {
        case OpStatus.Started: {
          dispatch(opAction);
          originalAction && dispatch(originalAction);
          broadcastAction && dispatch(broadcastAction);
          break;
        }
        default: {
          originalAction && dispatch(originalAction);
          broadcastAction && dispatch(broadcastAction);
          dispatch(opAction);
        }
      }
    }

    return next(action);
  };
}

export default createOpsMiddleware();
