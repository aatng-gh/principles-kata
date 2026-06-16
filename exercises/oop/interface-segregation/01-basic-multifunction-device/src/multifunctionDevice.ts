// exercises/oop/interface-segregation/01-basic-multifunction-device/src/multifunctionDevice.ts
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

export type IMachine = IPrinter & IScanner & IFax & ICopier;

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

export class BasicPrinter implements IPrinter {
  print(document: string): void {
    console.log(`[BASIC] printing: ${document}`);
  }
}

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
