import { LocalRepository } from "../LocalRepository";
import { promisify } from "util";
import { createHash } from "crypto";
import { readdir, stat, createReadStream } from "fs";
import { FileInfo } from "../FileInfo";
import { RepositoryState } from "../RepositoryState";
import { Task } from "./Task";
import { NotifyCallback } from "./NotifyCallback";
import { RepositoryUtils } from "../RepositoryUtils";

export class ScanRepositoryTask extends Task<void> {
  private readonly readDirAsync = promisify(readdir);
  private readonly statAsync = promisify(stat);
  public constructor(private readonly repository: LocalRepository, private readonly notify: NotifyCallback = () => {}) {
    super();
  }

  public async run() {
    this.repository.state = RepositoryState.SCANNING;
    this.repository.items = {};
    await this.scanFolder(this.repository.filesPath, "");
  }

  private async scanFolder(folder: string, relativePath: string) {
    const entries = await this.readDirAsync(folder, { withFileTypes: true });

    for (const entry of entries) {
      this.notify(`Scanning entry: ${entry.name}`);
      const entryPath = folder + "/" + entry.name;

      if (entry.isDirectory()) {
        await this.scanFolder(entryPath, `${relativePath}/${entry.name}`);
      } else {
        const item = new FileInfo();
        item.name = entry.name;
        item.hash = await RepositoryUtils.calculateFileMD5(entryPath);
        item.size = (await this.statAsync(entryPath)).size;

        // Remove the leading "/"
        const pathToSave = `${relativePath}/${entry.name}`.slice(1);
        this.repository.items[pathToSave] = item;
      }
    }
  }
}
