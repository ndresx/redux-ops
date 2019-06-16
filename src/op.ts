import * as actions from './actions';
import { OpId, OpStatus, OperationAction } from './typedefs';

export default class Op<TStatus = OpStatus, TData = any> {
  private id: OpId = '';

  constructor(opId: OpId) {
    this.id = opId;
  }

  public create = (status: TStatus, data?: TData): OperationAction<TStatus | OpStatus, TData> =>
    actions.createOperation(this.id, status, data);

  public update = (status: TStatus, data?: TData): OperationAction<TStatus | OpStatus, TData> =>
    actions.updateOperation(this.id, status, data);

  public delete = () => actions.deleteOperation(this.id);

  public getId(): OpId {
    return this.id;
  }
}
