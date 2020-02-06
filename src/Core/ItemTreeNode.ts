import { ItemState } from "./ItemState";

export class ItemTreeNode {
  public isDirectory: boolean = false;
  public state: ItemState = ItemState.PENDING_CREATION;
  public hash?: string;
  public size?: number;
  public children?: Record<string, ItemTreeNode>;
}
