import { LocalRepository } from "../LocalRepository";
import { RepositoryState } from "../RepositoryState";
import Axios from "axios";
import { RemoteRepository } from "../RemoteRepository";
import { NotifyCallback } from "./NotifyCallback";
import { Task } from "./Task";

export class VerifyRepositoryTask extends Task<void> {
  public constructor(private readonly localRepository: LocalRepository) {
    super();
  }

  public async run() {
    this.localRepository.state = RepositoryState.VERIFYING;
    const remoteRepository = RemoteRepository.fromPlain(Axios.get(this.localRepository.remoteUrls[0]));

    if (this.localRepository.version != remoteRepository.version) {
      this.localRepository.state = RepositoryState.UPDATES_PENDING;
      return;
    }
  }
}
