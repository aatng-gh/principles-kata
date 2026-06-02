// exercises/fp/declarative-transformation/01-basic-tree-processing/src/treeProcessing.ts
// STARTER — imperative loops + mutation to walk and accumulate totals/paths on the nodes themselves.
// Violates declarative: mutates the input tree, uses for loops, no recursion or higher-order fold.

export interface TreeNode {
  id: string;
  name: string;
  value: number;
  children: TreeNode[];
  path?: string; // mutated in
}

export function computeTotalsAndPaths(root: TreeNode): { total: number; paths: string[] } {
  let total = 0;
  const paths: string[] = [];

  function walk(node: TreeNode, parentPath: string) {
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
    // biome-ignore lint/suspicious/noExplicitAny: deliberate violation in starter (mutation demo)
    (node as any).path = currentPath; // mutation of input!
    paths.push(currentPath);
    total += node.value;

    for (const child of node.children) {
      walk(child, currentPath);
    }
  }

  walk(root, '');
  return { total, paths };
}

export function findNodesWithValueOver(root: TreeNode, threshold: number): TreeNode[] {
  const found: TreeNode[] = [];
  const stack = [root];
  while (stack.length) {
    // biome-ignore lint/style/noNonNullAssertion: deliberate in starter (stack not empty)
    const n = stack.pop()!;
    if (n.value > threshold) found.push(n);
    for (const c of n.children) stack.push(c); // mutates? no but imperative
  }
  return found;
}
