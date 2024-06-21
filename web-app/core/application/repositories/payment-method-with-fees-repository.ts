import { PaymentMethodWithFees } from "../entities/PaymentMethod/PaymentMethodWithFees"

export abstract class PaymentMethodWithFeesRepository {
  public abstract get(id: number): Promise<PaymentMethodWithFees>
}
