import { LocalRepository } from "../LocalRepository";
import { promisify } from "util";
import { createHash } from "crypto";
import { readdir, stat, createReadStream } from "fs";
import { FileInfo } from "../FileInfo";
import { RepositoryState } from "../RepositoryState";
import { Task } from "./Task";
import { NotifyCallback } from "./NotifyCallback";

export class ScanRepositoryTask extends Task<void> {
  private readonly readDirAsync = promisify(readdir);
  private readonly statAsync = promisify(stat);
  public constructor(private readonly repository: LocalRepository, private readonly notify: NotifyCallback = () => {}) {
    super();
  }

  public async run() {
    this.repository.state = RepositoryState.SCANNING;

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
        item.hash = await this.calculateMD5(entryPath);
        item.size = (await this.statAsync(entryPath)).size;

        // Remove the leading "/"
        const pathToSave = `${relativePath}/${entry.name}`.slice(1);
        this.repository.items[pathToSave] = item;
      }
    }
  }

  private async calculateMD5(path: string): Promise<string> {
    const md5 = createHash("md5");
    md5.setEncoding("hex");

    const promise = new Promise((resolve, reject) => {
      const fileStream = createReadStream(path);
      fileStream.pipe(md5);
      fileStream.on("end", () => {
        resolve(md5.read());
      });

      fileStream.on("error", reject);
    });

    return (await promise) as string;
  }
}
