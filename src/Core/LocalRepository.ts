import { RepositoryState } from "./RepositoryState";
import { ItemTreeNode } from "./ItemTreeNode";
import { Type } from "class-transformer";

export class LocalRepository {
  public name: string = "";
  public state: RepositoryState = RepositoryState.PENDING_SCAN;
  public version: number = 0;

  @Type(() => ItemTreeNode)
  public items: Record<string, ItemTreeNode> = {};

  public path: string = "";
  public remoteUrls: string[] = [];
  public enabledMods: string[] = [];

  public get repositoryFilePath() {
    return this.path + "/repository.json";
  }
}
