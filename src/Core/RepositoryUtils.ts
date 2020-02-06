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
    // https://stackoverflow.com/questions/4498866/actual-numbers-to-the-human-readable-values
    var sizes = ["bytes", "kB", "MB", "GB", "TB", "PB"];
    var e = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, e)).toFixed(2) + " " + sizes[e];
  }
}
