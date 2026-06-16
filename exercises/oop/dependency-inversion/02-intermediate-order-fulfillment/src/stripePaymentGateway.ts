import type { PaymentGateway } from './ports';

export class StripePaymentGateway implements PaymentGateway {
  async charge(orderId: string, amount: number): Promise<{ success: boolean; chargeId?: string }> {
    console.log(`[STRIPE] charged ${amount} for ${orderId}`);
    return { success: true, chargeId: `ch_${orderId}` };
  }
}
