// Barrel to preserve exact public contract (imports from '../src/pricingRules' in tests continue to work).
// Separation of concerns (per Pure Core/Impure Shell):
// - Pure, deterministic, effect-free logic lives ONLY in pure.ts (exports calculatePricePure only + types).
// - Effects (DB lookup, console, default now) live ONLY in shell.ts which calls the pure fn.
// The alias `calculatePrice` is re-exported here (documented in shell) solely for test contract compatibility.
export * from './pure';
export * from './shell';
