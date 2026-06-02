# Why (branded 01)

Uses unique symbol for the brand so it truly can't be faked structurally at runtime or easily at type level without going through the ctor. The `brand` function is the single trusted point. This prevents the "construct from raw primitive" anti-pattern called out in AGENTS.
