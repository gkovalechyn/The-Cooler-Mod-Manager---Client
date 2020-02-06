import { RepositoryState } from "./RepositoryState";
import { Type } from "class-transformer";
import { FileInfo } from "./FileInfo";

export class RemoteRepository {
  public name: string = "";
  public state: RepositoryState = RepositoryState.PENDING_SCAN;
  public version: number = 0;
  public items: Record<string, FileInfo> = {};

  public static fromPlain(plainObject: any) {
    const remote = new RemoteRepository();
    remote.name = plainObject.name;
    remote.state = plainObject.state;
    remote.version = plainObject.version;
    remote.version = plainObject.version;

    if (plainObject.items) {
      remote.items = plainObject.items;
    }

    return remote;
  }
}
