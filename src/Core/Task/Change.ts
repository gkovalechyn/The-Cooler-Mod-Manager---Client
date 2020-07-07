import { ItemState } from "../ItemState";

export class Change {
  public constructor(public readonly path = "", public type = ItemState.PENDING_CREATION, public readonly size = 0) {}
}
