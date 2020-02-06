import { RemoteRepository } from "./RemoteRepository";
import { FileInfo } from "./FileInfo";

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
}
