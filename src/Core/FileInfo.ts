import { ItemState } from "./ItemState";

export class FileInfo {
  public name: string = "";
  public size: number = 0;
  public hash: string = "";
  public state: ItemState = ItemState.PENDING_CREATION;
}
