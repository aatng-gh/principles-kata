# Why this design (DIP basic notification service)

`OrderProcessor` (high level policy) now only knows `INotifier` and `ILogger`. It never imports or constructs `EmailSender`, `SmsSender`, or `FileLogger`.

The three low-level classes implement the abstractions (details depend on abstractions).

The optional parameters + `createDefaultOrderProcessor` preserve the original `new OrderProcessor()` call site for the exercise test while making the injected path the documented, testable, and swappable one.

A test can now do:
  const fakeEmail: INotifier = { async send() { recorded.push('email'); } };
  const p = new OrderProcessor(fakeEmail, fakeSms, fakeLog);
  await p.process(order);
  // assert on recorded, no console, no real channels

Swapping channels or loggers is a one-line change at the wiring site (or in a DI container / factory) with zero edits to the processor.
