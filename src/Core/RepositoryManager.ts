import { LocalRepository } from "./LocalRepository";
import { readFile, existsSync, writeFile } from "fs";
import { promisify } from "util";
import { RepositoryDetails } from "./RepositoryDetails";
import { remote } from "electron";
import { RemoteRepository } from "./RemoteRepository";
import { serialize, deserialize } from "class-transformer";
import { RepositoryState } from "./RepositoryState";

class RepositoryManager {
  private localRepositories: LocalRepository[] = [];

  public constructor() {
    this.loadRepositories();
  }

  public get LocalRepositories() {
    return this.localRepositories;
  }

  public createFromRemoteRepository(remote: RemoteRepository, urls: string[], folder: string) {
    const local = new LocalRepository();
    local.name = remote.name;
    local.state = RepositoryState.PENDING_SCAN;
    local.path = folder;
    local.items = remote.items;
    local.remoteUrls = urls;

    this.localRepositories.push(local);

    this.saveRepositories();
  }

  public async saveRepositories() {
    const details: RepositoryDetails[] = [];
    const promises: Promise<void>[] = [];
    const writeFileAsync = promisify(writeFile);

    for (const repository of this.localRepositories) {
      details.push({
        name: repository.name,
        path: repository.path
      });

      promises.push(writeFileAsync(repository.repositoryFilePath, serialize(repository)));
    }

    promises.push(writeFileAsync(remote.app.getAppPath() + "/repositories.json", JSON.stringify(details)));

    return Promise.all(promises);
  }

  public async loadRepositories() {
    const path = remote.app.getAppPath() + "/repositories.json";
    const readFileAsync = promisify(readFile);

    if (existsSync(path)) {
      const repositoryList = JSON.parse(await readFileAsync(path, { encoding: "utf8" })) as RepositoryDetails[];

      for (const detail of repositoryList) {
        this.loadSingleRepository(detail).then(repository => {
          if (repository) {
            this.localRepositories.push(repository);
          }
        });
      }
    }
  }

  private async loadSingleRepository(details: RepositoryDetails) {
    const filePath = details.path + "/repository.json";
    const readFileAsync = promisify(readFile);

    if (existsSync(filePath)) {
      return deserialize(LocalRepository, await readFileAsync(filePath, { encoding: "utf8" }));
    }

    return null;
  }
}

export default new RepositoryManager();
