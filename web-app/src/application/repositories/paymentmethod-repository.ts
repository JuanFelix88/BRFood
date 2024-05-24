export abstract class PaymentMethodRepository {
  public abstract existsIds(id: { paymentMethodId: number }[]): Promise<boolean>
}
