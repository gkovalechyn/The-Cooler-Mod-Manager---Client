import { RemoteRepository } from "./RemoteRepository";
import { RepositoryState } from "./RepositoryState";

export class LocalRepository extends RemoteRepository {
  public path: string = "";
  public remoteUrls: string[] = [];
  public enabledMods: string[] = [];

  public get repositoryFilePath() {
    return this.path + "/repository.json";
  }

  public get filesPath() {
    return this.path + "/files";
  }

  public static fromPlain(plainObject: any) {
    // Build off of the remote version so we don't have to
    // duplicate everything
    const remote = RemoteRepository.fromPlain(plainObject);
    const local = new LocalRepository();

    local.name = remote.name;
    local.state = plainObject.state || RepositoryState.PENDING_SCAN;
    local.version = remote.version;
    local.items = remote.items;
    local.path = plainObject.path;
    local.remoteUrls = plainObject.remoteUrls;
    local.enabledMods = plainObject.enabledMods;

    return local;
  }
}
