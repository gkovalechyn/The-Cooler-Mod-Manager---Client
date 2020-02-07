import { LocalRepository } from "../LocalRepository";
import { RepositoryState } from "../RepositoryState";
import Axios from "axios";
import { RemoteRepository } from "../RemoteRepository";
import { NotifyCallback } from "./NotifyCallback";
import { Task } from "./Task";
import { ComputeChangesTask } from "./ComputeChangesTask";

export class VerifyRepositoryTask extends Task<void> {
  public constructor(private readonly localRepository: LocalRepository) {
    super();
  }

  public async run() {
    this.localRepository.state = RepositoryState.VERIFYING;
    const remoteRepository = RemoteRepository.fromPlain((await Axios.get(this.localRepository.remoteUrls[0])).data);

    if (this.localRepository.version != remoteRepository.version) {
      console.log(`Local: ${this.localRepository.version}, remote: ${remoteRepository.version}`);
      this.localRepository.state = RepositoryState.UPDATES_PENDING;
      return;
    }

    const changes = await new ComputeChangesTask(this.localRepository, remoteRepository).run();

    if (changes.length > 0) {
      this.localRepository.state = RepositoryState.UPDATES_PENDING;
    } else {
      this.localRepository.state = RepositoryState.READY;
    }
  }
}
