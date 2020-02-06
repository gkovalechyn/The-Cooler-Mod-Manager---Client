import { RepositoryState } from "./RepositoryState";
export interface RepositoryDetails {
  name: string;
  version: number;
  state: RepositoryState;
  path: string;
}
