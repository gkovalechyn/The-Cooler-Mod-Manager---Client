export interface ItemTreeNode {
  isDirectory: boolean;
  hash?: string;
  size?: number;
  children?: Record<string, ItemTreeNode>;
}
