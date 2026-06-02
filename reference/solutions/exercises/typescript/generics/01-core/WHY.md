# Why this design (generics/01-core)

- Uses constrained type parameter on `set` (`K extends keyof Shape`) so invalid keys are compile errors.
- The builder is generic over the target `Shape`, so callers get exact literal types back from `.build()`.
- Works for both fluent OOP usage (chained sets on an instance) and inside pure functions (the returned object is just data).
- No `any` in the public surface of a completed version (the reference keeps one small internal cast for chaining ergonomics; a production version could use a different builder pattern with a separate "builder state" type for perfect chaining types).

This pattern appears all the time in real code: config builders, test data factories, query builders, etc. The same generic machinery powers both class-based and functional styles without duplication.
