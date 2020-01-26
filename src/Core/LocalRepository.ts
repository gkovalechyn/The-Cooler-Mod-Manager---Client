import { RemoteRepository } from "./RemoteRepository";
export interface LocalRepository extends RemoteRepository {
  remoteUrls: string[];
  enabledMods: string[];
}
