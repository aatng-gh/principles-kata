// ISP-segregated design.
// Small interfaces for each capability.
// Clients depend only on what they use.
// The real machine implements the union (and we keep a convenience IMachine type alias for full clients).

export interface IPrinter {
  print(document: string): void;
}

export interface IScanner {
  scan(): string;
}

export interface IFax {
  fax(destination: string, document: string): void;
}

export interface ICopier {
  copy(): void;
}

// Convenience for code that really needs the full machine (admin).
export type IMachine = IPrinter & IScanner & IFax & ICopier;

export class MultiFunctionMachine implements IPrinter, IScanner, IFax, ICopier {
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

// Basic printer client now only depends on (and implements) IPrinter.
export class BasicPrinter implements IPrinter {
  print(document: string): void {
    console.log(`[BASIC] printing: ${document}`);
  }
}

// Fax gateway only depends on IFax.
export class FaxGateway implements IFax {
  fax(destination: string, document: string): void {
    console.log(`[FAX] sending to ${destination}: ${document}`);
  }
}

export class AdminConsole {
  constructor(private machine: IMachine) {}
  runFullDiagnostics(): void {
    this.machine.print('diag-page');
    this.machine.scan();
    this.machine.fax('admin@fax', 'report');
    this.machine.copy();
  }
}
