import { RepositoryState } from "./RepositoryState";
import { ItemTreeNode } from "./ItemTreeNode";

export interface RemoteRepository {
  name: string;
  state: RepositoryState;
  version: number;
  items: Record<string, ItemTreeNode>;
}
