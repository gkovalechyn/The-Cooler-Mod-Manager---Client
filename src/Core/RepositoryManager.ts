import { LocalRepository } from "./LocalRepository";
import { readFile, existsSync, writeFile, mkdirSync } from "fs";
import { promisify } from "util";
import { RepositoryDetails } from "./RepositoryDetails";
import { remote } from "electron";
import { serialize } from "class-transformer";
import { RepositoryState } from "./RepositoryState";
import { VerifyRepositoryTask } from "./Task/VerifyRepositoryTask";
import { ScanRepositoryTask } from "./Task/ScanRepositoryTask";

class RepositoryManager {
  private localRepositories: LocalRepository[] = [];

  public constructor() {
    this.loadRepositories().then(this.verifyRepositories.bind(this));
  }

  public get LocalRepositories() {
    return this.localRepositories;
  }

  public createFromRemoteRepository(name: string, urls: string[], folder: string) {
    const local = new LocalRepository();
    local.name = name;
    local.state = RepositoryState.PENDING_SCAN;
    local.path = folder;
    local.remoteUrls = urls;

    this.localRepositories.push(local);

    mkdirSync(local.filesPath, { recursive: true });

    this.saveRepositories();
  }

  public async saveRepositories() {
    const details: RepositoryDetails[] = [];
    const promises: Promise<void>[] = [];
    const writeFileAsync = promisify(writeFile);

    for (const repository of this.localRepositories) {
      details.push({
        name: repository.name,
        version: repository.version,
        state: repository.state,
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
        const repository = await this.loadSingleRepository(detail);

        if (repository) {
          this.localRepositories.push(repository);
        }
      }
    }
  }

  private async loadSingleRepository(details: RepositoryDetails) {
    const filePath = details.path + "/repository.json";
    const readFileAsync = promisify(readFile);

    if (existsSync(filePath)) {
      const jsonBlob = JSON.parse(await readFileAsync(filePath, { encoding: "utf8" }));
      return LocalRepository.fromPlain(jsonBlob);
    }

    return null;
  }

  private async verifyRepositories() {
    for (const repository of this.localRepositories) {
      switch (repository.state) {
        case RepositoryState.READY:
          // If the repository is ready, we'll need to check with the server
          // to make sure the server repository hasn't changed
          new VerifyRepositoryTask(repository).run(() => {});
          break;

        case RepositoryState.PENDING_SCAN:
          new ScanRepositoryTask(repository)
            .run(() => {})
            .then(() => {
              new VerifyRepositoryTask(repository).run(() => {});
            });
          break;
        case RepositoryState.SCANNING:
          break;
        case RepositoryState.UPDATES_PENDING:
          break;
        default:
          repository.state = RepositoryState.PENDING_SCAN;
      }
    }
  }
}

export default new RepositoryManager();
