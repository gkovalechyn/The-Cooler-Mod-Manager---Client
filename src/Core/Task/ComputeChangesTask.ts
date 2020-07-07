import { LocalRepository } from "../LocalRepository";
import { RemoteRepository } from "../RemoteRepository";
import { Change } from "./Change";
import { ItemState } from "../ItemState";
import { Task } from "./Task";
import { NotifyCallback } from "./NotifyCallback";

export class ComputeChangesTask extends Task<Change[]> {
  private changes: Change[] = [];

  public constructor(private readonly local: LocalRepository, private readonly remote: RemoteRepository) {
    super();
  }

  public async run() {
    const remoteItems = this.remote.items;

    // Find changed or missing items
    for (const relativePath of Object.keys(remoteItems)) {
      const remoteItem = this.remote.items[relativePath];

      if (!this.local.items[relativePath]) {
        this.changes.push(new Change(relativePath, ItemState.PENDING_CREATION, remoteItem.size));
      } else {
        const localItem = this.local.items[relativePath];

        if (localItem.hash != remoteItem.hash) {
          console.log(relativePath);
          console.log(`Local hash: ${localItem.hash}, remote hash: ${remoteItem.hash}`);
          console.log(`Local size: ${localItem.size}, remote size: ${remoteItem.size}`);
          this.changes.push(new Change(relativePath, ItemState.PENDING_UPDATE, remoteItem.size));
        }
      }
    }

    await this.findDeletedItems();

    return this.changes;
  }

  private async findDeletedItems() {
    const localItems = this.local.items;

    for (const relativePath of Object.keys(localItems)) {
      if (!this.remote.items[relativePath]) {
        this.changes.push(new Change(relativePath, ItemState.PENDING_DELETE, localItems[relativePath].size));
      }
    }
  }
}
