import { RemoteRepository } from "./RemoteRepository";
import { ItemTreeNode } from "./ItemTreeNode";
export class RepositoryUtils {
  public static async calculateRepositorySize(repository: RemoteRepository) {
    let size = 0;

    for (const itemName of Object.keys(repository.items)) {
      size += RepositoryUtils.calculateNodeSize(repository.items[itemName]);
    }

    return size;
  }

  private static calculateNodeSize(item: ItemTreeNode) {
    if (item.isDirectory && item.children) {
      let size = 0;

      for (const key of Object.keys(item.children!)) {
        size += RepositoryUtils.calculateNodeSize(item.children[key]);
      }

      return size;
    } else {
      return item.size!;
    }
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
