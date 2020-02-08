import { RemoteRepository } from "./RemoteRepository";
import { FileInfo } from "./FileInfo";
import { createHash } from "crypto";
import { createReadStream } from "fs";

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

    console.log("Creating promise");
    const promise = new Promise<string>((resolve, reject) => {
      const fileStream = createReadStream(path, {
        autoClose: true,
        emitClose: true
      });

      fileStream.on("open", () => console.log("STREAM OPEN"));
      fileStream.on("ready", () => console.log("STREAM READY"));
      fileStream.on("close", () => {
        console.log("Stream closed");
        resolve(md5.read());
      });

      fileStream.on("data", data => {
        console.log(data);
      });

      fileStream.on("end", () => {
        console.log("Stream ENDED");
        resolve(md5.read());
      });

      fileStream.on("error", error => {
        console.error(error);
        reject(error);
      });

      console.log("Piping to MD5");
      // fileStream.pipe(md5, { end: true });
      // fileStream.resume();
      console.log("Is paused?: " + fileStream.isPaused());
    });
    console.log("Returning promise");
    return promise;
  }
}
