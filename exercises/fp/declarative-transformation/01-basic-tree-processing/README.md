# Declarative Transformation & Recursion — Basic: Tree Processing

## Principle (recap)
Declarative code describes *what* the result is (via recursion, map/filter/reduce/fold over structure, or pattern matching) rather than *how* to traverse with loops and mutation. For recursive data like trees this means pure recursive functions or higher-order tree folds that produce new values or aggregates without mutating the original structure. TS discriminated unions + exhaustiveness checking help ensure all cases are handled.

## Scenario
You have a category tree (or org chart, file system, menu) where each node has a numeric value. The original code walks it with for-loops and a stack, mutates `.path` and accumulates into module or outer vars. This makes it impossible to process a subtree in isolation, corrupts the caller's data, and is hard to reason about or parallelize.

## Functional Requirements
- Given a TreeNode (with id, name, value, children[]), compute the sum of all values in the subtree.
- Also produce the list of "paths" (e.g. "Root/Child/Leaf") for every node, in any order.
- Provide a query: find all nodes whose value > threshold (return the nodes or their ids).
- The input tree must be left unchanged (no .path written, no value changes).

## Starter
See `src/treeProcessing.ts` — uses recursive walk but mutates nodes, plus an imperative stack search; both pollute the input and use mutation for "results".

## Criteria (principle-specific)
- All processing is declarative: recursive pure functions (e.g. `sumTree(node): number`, `paths(node, parent): string[]`) or a fold that builds the result.
- No mutation of the input tree or its descendants.
- No `for`/`while` loops that mutate accumulators or the tree; use `map`, `reduce`, `flatMap`, recursion, or `for...of` only over copies if needed.
- Results are returned as new data structures; the original tree shape is never altered.

## Expectations
- Use `readonly` for children in the good type.
- Recursion bottoms out on leaves (children.length === 0 or no children).
- For the find, a pure recursive collector or reduce that concatenates.
- Tests (including the "input unchanged" deep equal) pass.
- Bonus: a single `foldTree` HOF that takes node visitors or aggregators, used for both sum and paths.

## Getting Started
```bash
npx vitest run exercises/fp/declarative-transformation/01-basic-tree-processing
```

## How the judge will evaluate
See AGENTS.md rubric. The tests assert numeric results + that the input tree has no observable change (no path props added). The judge will catch "I used recursion but still did node.path = ..." or "I built a new tree but the children arrays are the original mutated ones".

## After you are done
Follow the exact order in the root README: tests green → self-checklist → judge via AGENTS.md (adversarial) → *only then* reveal reference/solutions.
