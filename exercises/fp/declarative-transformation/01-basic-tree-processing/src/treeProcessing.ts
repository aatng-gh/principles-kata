// exercises/fp/declarative-transformation/01-basic-tree-processing/src/treeProcessing.ts
export interface TreeNode {
  readonly id: string;
  readonly name: string;
  readonly value: number;
  readonly children: readonly TreeNode[];
  readonly path?: string;
}

const sumTree = (node: TreeNode): number =>
  node.value + node.children.reduce((total, child) => total + sumTree(child), 0);

const pathsForTree = (node: TreeNode, parentPath = ''): string[] => {
  const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
  return [currentPath, ...node.children.flatMap((child) => pathsForTree(child, currentPath))];
};

export const computeTotalsAndPaths = (root: TreeNode): { total: number; paths: string[] } => ({
  total: sumTree(root),
  paths: pathsForTree(root),
});

export const findNodesWithValueOver = (root: TreeNode, threshold: number): TreeNode[] => [
  ...(root.value > threshold ? [root] : []),
  ...root.children.flatMap((child) => findNodesWithValueOver(child, threshold)),
];
