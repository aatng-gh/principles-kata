// exercises/oop/interface-segregation/01-basic-multifunction-device/src/multifunctionDevice.ts
// THIS IS THE STARTER — single fat IMachine interface.
// "Clients" (BasicPrinter, FaxGateway) are forced to implement the whole thing with dummies.
// Delivers the observable behavior the test needs (print works on printer client, fax on fax client).

export interface IMachine {
  print(document: string): void;
  scan(): string;
  fax(destination: string, document: string): void;
  copy(): void;
}

export class MultiFunctionMachine implements IMachine {
  print(document: string): void {
    console.log(`[MFP] printing: ${document}`);
  }
  scan(): string {
    const content = 'scanned-content';
    console.log('[MFP] scanned');
    return content;
  }
  fax(destination: string, document: string): void {
    console.log(`[MFP] faxing to ${destination}: ${document}`);
  }
  copy(): void {
    console.log('[MFP] copying');
  }
}

// "Client" that only wants to print, but is forced to implement everything.
export class BasicPrinter implements IMachine {
  print(document: string): void {
    console.log(`[BASIC] printing: ${document}`);
  }
  scan(): string {
    // forced
    throw new Error('scan not supported on basic printer');
  }
  fax(destination: string, document: string): void {
    throw new Error('fax not supported on basic printer');
  }
  copy(): void {
    throw new Error('copy not supported on basic printer');
  }
}

// Client that only wants fax.
export class FaxGateway implements IMachine {
  print(document: string): void {
    throw new Error('print not supported on fax gateway');
  }
  scan(): string {
    throw new Error('scan not supported on fax gateway');
  }
  fax(destination: string, document: string): void {
    console.log(`[FAX] sending to ${destination}: ${document}`);
  }
  copy(): void {
    throw new Error('copy not supported on fax gateway');
  }
}

// Full admin client can use the real machine (or anything implementing IMachine).
export class AdminConsole {
  constructor(private machine: IMachine) {}
  runFullDiagnostics(): void {
    this.machine.print('diag-page');
    this.machine.scan();
    this.machine.fax('admin@fax', 'report');
    this.machine.copy();
  }
}
