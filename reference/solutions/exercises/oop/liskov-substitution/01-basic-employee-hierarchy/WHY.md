# Why this design (LSP basic employee hierarchy)

The base Employee now documents its contract via implementation: calculatePay always >=0 (enforced by construction), approveExpense for amount in (0, max] returns true.

Subtypes only specialize the maxExpenseApproval (higher for manager, lower/0 for contractor/intern) and/or add to pay positively (manager bonus). Contractor and Intern still have their "special" economics (hourly, zero stipend) but never throw and never return false for an amount the base would have accepted for that instance's limit.

Result: code written against `Employee` (the polymorphic payroll processor in the test) can now safely accept *any* subtype in the array, including mixes with Contractor and Intern, and get predictable bools and non-negative pays. No client changes or casts needed when a new subtype appears.

The original violations (throw from Intern, always-false from Contractor for small amounts that base type would accept) are eliminated while preserving the business intent of the roles.
