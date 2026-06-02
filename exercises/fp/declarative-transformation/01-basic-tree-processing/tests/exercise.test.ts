// exercises/fp/declarative-transformation/01-basic-tree-processing/tests/exercise.test.ts
import { beforeEach, describe, expect, it } from 'vitest';
import {
  type TreeNode,
  computeTotalsAndPaths,
  findNodesWithValueOver,
} from '../src/treeProcessing';

describe('treeProcessing (declarative basic)', () => {
  let root: TreeNode;

  beforeEach(() => {
    root = {
      id: 'root',
      name: 'Root',
      value: 10,
      children: [
        {
          id: 'a',
          name: 'A',
          value: 5,
          children: [{ id: 'a1', name: 'A1', value: 3, children: [] }],
        },
        { id: 'b', name: 'B', value: 7, children: [] },
      ],
    };
  });

  it('computes correct total and paths', () => {
    const { total, paths } = computeTotalsAndPaths(root);
    expect(total).toBe(25);
    expect(paths).toContain('Root/A/A1');
    expect(paths).toContain('Root/B');
  });

  it('finds nodes over threshold', () => {
    const over = findNodesWithValueOver(root, 6);
    expect(over.map((n) => n.id)).toEqual(['root', 'b']);
  });

  it('does not mutate the input tree (paths not written back)', () => {
    const original = JSON.parse(JSON.stringify(root));
    computeTotalsAndPaths(root);
    expect(root.path).toBeUndefined();
    expect(JSON.parse(JSON.stringify(root))).toEqual(original);
  });
});
