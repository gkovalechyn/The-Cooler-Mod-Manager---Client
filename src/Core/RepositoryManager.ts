import { LocalRepository } from "./LocalRepository";
import { readFile, existsSync, writeFile, mkdirSync, readFileSync } from "fs";
import { promisify } from "util";
import { RepositoryDetails } from "./RepositoryDetails";
import { remote, EventEmitter } from "electron";
import { serialize } from "class-transformer";
import { RepositoryState } from "./RepositoryState";
import { VerifyRepositoryTask } from "./Task/VerifyRepositoryTask";
import { ScanRepositoryTask } from "./Task/ScanRepositoryTask";

class RepositoryManager {
  private localRepositories: LocalRepository[] = [];

  public constructor() {
    this.loadRepositories();
    this.verifyRepositories();
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
        path: repository.path
      });

      promises.push(writeFileAsync(repository.repositoryFilePath, serialize(repository)));
    }

    promises.push(writeFileAsync(remote.app.getAppPath() + "/repositories.json", JSON.stringify(details)));

    return Promise.all(promises);
  }

  public loadRepositories() {
    const path = remote.app.getAppPath() + "/repositories.json";

    if (existsSync(path)) {
      const fileContents = readFileSync(path, { encoding: "utf8" });
      const repositoryList = JSON.parse(fileContents) as RepositoryDetails[];

      for (const detail of repositoryList) {
        const repository = this.loadSingleRepository(detail);

        if (repository) {
          this.localRepositories.push(repository);
        }
      }
    }
  }

  private loadSingleRepository(details: RepositoryDetails) {
    const filePath = details.path + "/repository.json";

    if (existsSync(filePath)) {
      const jsonBlob = JSON.parse(readFileSync(filePath, { encoding: "utf8" }));
      return LocalRepository.fromPlain(jsonBlob);
    }

    return null;
  }

  public verifyRepositories() {
    for (const repository of this.localRepositories) {
      switch (repository.state) {
        case RepositoryState.READY:
          // If the repository is ready, we'll need to check with the server
          // to make sure the server repository hasn't changed
          new VerifyRepositoryTask(repository).run();
          break;

        case RepositoryState.PENDING_SCAN:
        case RepositoryState.SCANNING:
          new ScanRepositoryTask(repository)
            .run()
            .then(() => new VerifyRepositoryTask(repository).run())
            .then(() => {
              this.saveRepositories();
            });
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
