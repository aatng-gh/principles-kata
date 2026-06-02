// Reference copy of the test (passes against the good declarative impl).
import { beforeEach, describe, expect, it } from 'vitest';
import {
  type TreeNode,
  computeTotalsAndPaths,
  findNodesWithValueOver,
} from '../src/treeProcessing';

describe('treeProcessing reference (declarative)', () => {
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
  it('computes and does not mutate', () => {
    const orig = JSON.parse(JSON.stringify(root));
    const { total } = computeTotalsAndPaths(root);
    expect(total).toBe(25);
    expect(root).toEqual(orig);
  });
});
