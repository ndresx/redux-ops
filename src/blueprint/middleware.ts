import { Middleware } from 'redux';

import * as actionTypes from '../action_types';
import { OpStatus, Operation } from '../typedefs';
import { OpsBlueprintActionData, OpsBlueprintOriginalAction } from './typedefs';

function createOpsMiddleware(): Middleware {
  return ({ dispatch }) => next => action => {
    if (action[actionTypes.prefix] && action[actionTypes.prefix].operationAction) {
      const blueprintAction: OpsBlueprintActionData = action[actionTypes.prefix];
      const { operationAction, originalAction, broadcast, uniqueId } = blueprintAction;
      const opStatus = operationAction.payload.status;
      let operationActionMod = { ...operationAction };
      let broadcastAction: OpsBlueprintOriginalAction | undefined = undefined;

      if (broadcast && !originalAction) {
        let broadcastActionType = operationActionMod.type;

        if (opStatus && broadcastActionType === actionTypes.UPDATE) {
          broadcastActionType = opStatus.toUpperCase();
        } else {
          broadcastActionType = broadcastActionType.replace(actionTypes.prefix, '');
        }

        broadcastAction = {
          type: `${operationActionMod.payload.id}_${broadcastActionType}`,
          payload: { ...operationActionMod.payload },
        };

        if (opStatus !== OpStatus.Delete) {
          // Create a custom action based on the operation's status
          operationActionMod = {
            ...operationActionMod,
            payload: {
              ...operationActionMod.payload,
              data: undefined,
            } as Operation<undefined>,
          };
        }
      }

      // Exchange original op action id with unique id
      if (uniqueId) {
        operationActionMod = {
          ...operationActionMod,
          payload: {
            ...operationActionMod.payload,
            id: uniqueId,
          },
        };

        if (broadcastAction) {
          broadcastAction[actionTypes.prefix] = { uniqueId };
        }
      }

      switch (opStatus) {
        case OpStatus.Start: {
          dispatch(operationActionMod);
          originalAction && dispatch(originalAction);
          broadcastAction && dispatch(broadcastAction);
          break;
        }
        default: {
          originalAction && dispatch(originalAction);
          broadcastAction && dispatch(broadcastAction);
          dispatch(operationActionMod);
        }
      }
    }

    return next(action);
  };
}

export default createOpsMiddleware();
