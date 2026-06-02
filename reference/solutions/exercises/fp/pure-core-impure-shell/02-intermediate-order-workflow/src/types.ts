export interface Order {
  readonly id: string;
  readonly userId: string;
  readonly total: number;
  readonly status: string;
}

export type Decision =
  | { kind: 'Approve'; chargeAmount: number }
  | { kind: 'Reject'; reason: string };

export type Command =
  | { kind: 'UpdateStatus'; orderId: string; status: string }
  | { kind: 'SendEmail'; message: string }
  | { kind: 'Charge'; amount: number };

export interface ProcessResult {
  readonly ok: boolean;
  readonly message: string;
}
