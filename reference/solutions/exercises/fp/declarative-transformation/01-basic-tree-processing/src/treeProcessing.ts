// Reference good implementation — declarative recursion + pure folds over the tree.
// Why this design: recursion mirrors the data shape (node + children list). Each fn returns new values or
// aggregates; the original tree is never touched (children are readonly). map/reduce on children for
// declarative "what not how". Exhaustive on the recursive case (leaf vs branch implicit by children.length).
// Easy to add e.g. "max depth" by extending the recursion.

export interface TreeNode {
  readonly id: string;
  readonly name: string;
  readonly value: number;
  readonly children: readonly TreeNode[];
}

export function sumTree(node: TreeNode): number {
  return node.value + node.children.reduce((s, c) => s + sumTree(c), 0);
}

export function collectPaths(node: TreeNode, parentPath = ''): readonly string[] {
  const current = parentPath ? `${parentPath}/${node.name}` : node.name;
  const childPaths = node.children.flatMap((c) => collectPaths(c, current));
  return [current, ...childPaths];
}

export function computeTotalsAndPaths(root: TreeNode): { total: number; paths: readonly string[] } {
  return {
    total: sumTree(root),
    paths: collectPaths(root),
  };
}

export function findNodesWithValueOver(node: TreeNode, threshold: number): readonly TreeNode[] {
  const here = node.value > threshold ? [node] : [];
  const below = node.children.flatMap((c) => findNodesWithValueOver(c, threshold));
  return [...here, ...below];
}
