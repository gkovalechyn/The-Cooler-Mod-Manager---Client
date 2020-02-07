import { RemoteRepository } from "./RemoteRepository";
import { FileInfo } from "./FileInfo";
import { createHash } from "crypto";
import { createReadStream } from "original-fs";

export class RepositoryUtils {
  public static async calculateRepositorySize(repository: RemoteRepository) {
    let size = 0;

    for (const itemName of Object.keys(repository.items)) {
      const item = repository.items[itemName];
      size += item.size;
    }

    return size;
  }

  public static sizeToHumanReadableString(size: number) {
    let i = 0;
    const units = [" bytes", " kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
    while (size > 1024) {
      size = size / 1024;
      i++;
    }

    return size.toFixed(2) + units[i];
  }

  public static async calculateFileMD5(path: string) {
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
