import { Sale } from "@/core/application/entities/Sale/Sale"
import { MapperErrors } from "@/core/application/errors"
import { AmountValue } from "@/core/shared/entities/AmountValue"
import { CurrencyValue } from "@/core/shared/entities/CurrencyValue"
import { DateTime } from "@/core/shared/entities/DateTime"
import { UUID } from "@/core/shared/entities/UUID"
import { StaticClass } from "@/core/shared/utils/static-class"
import { z } from "zod"

export class SaleMapper extends StaticClass {
  public static toDomain(raw: z.input<typeof schema>): Sale {
    try {
      return schema.parse(raw)
    } catch (error) {
      throw new MapperErrors.MappingError(SaleMapper, error)
    }
  }
}

const payment = z
  .union([
    z.object({
      id: z.number().int().nonnegative(),
      client_id: z.number().int().nonnegative(),
      client_name: z.string(),

      client_credit_id: z
        .number()
        .nullable()
        .transform((v) => null),
      credit_payment_value: z
        .number()
        .nullable()
        .transform((v) => null),
      new_client_credit_value: z
        .number()
        .nullable()
        .transform((v) => null),

      payment_method_id: z.number().int().nonnegative(),
      payment_method_fee_id: z.number(),
      payment_method_name: z.string(),
      payment_method_value: z
        .number()
        .nonnegative()
        .transform((v) => new CurrencyValue(v)),
    }),
    z.object({
      id: z.number().int().nonnegative(),
      client_id: z.number().int().nonnegative(),
      client_name: z.string(),
      client_credit_id: z.number().int().nonnegative(),
      credit_payment_value: z
        .number()
        .nonnegative()
        .transform((v) => new CurrencyValue(v)),
      new_client_credit_value: z.number().transform((v) => new CurrencyValue(v)),
      payment_method_id: z
        .number()
        .nullable()
        .transform((v) => null),
      payment_method_fee_id: z
        .number()
        .nullable()
        .transform((v) => null),
      payment_method_name: z
        .number()
        .nullable()
        .transform((v) => null),
      payment_method_value: z
        .number()
        .nullable()
        .transform((v) => null),
    }),
    z.object({
      id: z.number().int().nonnegative(),

      client_id: z
        .number()
        .nullable()
        .transform((v) => null),
      client_name: z
        .string()
        .nullable()
        .transform((v) => null),

      client_credit_id: z
        .number()
        .nullable()
        .transform((v) => null),
      credit_payment_value: z
        .number()
        .nullable()
        .transform((v) => null),
      new_client_credit_value: z
        .number()
        .nullable()
        .transform((v) => null),

      payment_method_id: z.number().int().nonnegative(),
      payment_method_fee_id: z.number(),
      payment_method_name: z.string(),
      payment_method_value: z
        .number()
        .nonnegative()
        .transform((v) => new CurrencyValue(v)),
    }),
  ])
  .transform((payment) => {
    if (
      typeof payment.client_id === "number" &&
      !payment.payment_method_fee_id &&
      typeof payment.client_name === "string" &&
      typeof payment.client_credit_id === "number"
    ) {
      return {
        id: payment.id,
        client: {
          clientId: payment.client_id,
          clientName: payment.client_name,
        },
        creditPayment: {
          clientCreditId: payment.client_credit_id,
          value: payment.credit_payment_value,
          newClientCreditValue: payment.new_client_credit_value,
        },
      }
    }

    if (
      typeof payment.client_id === "number" &&
      typeof payment.payment_method_fee_id === "number" &&
      typeof payment.payment_method_id === "number"
    ) {
      return {
        id: payment.id,
        client: {
          clientId: payment.client_id,
          clientName: payment.client_name,
        },
        paymentMethod: {
          name: payment.payment_method_name,
          paymentMethodId: payment.payment_method_id,
          paymentMethodFeeId: payment.payment_method_fee_id,
          value: payment.payment_method_value,
        },
      }
    }

    if ("payment_method_id" in payment && !payment.client_credit_id) {
      return {
        id: payment.id,
        paymentMethod: {
          paymentMethodId: payment.payment_method_id,
          name: payment.payment_method_name,
          paymentMethodFeeId: payment.payment_method_fee_id,
          value: payment.payment_method_value,
        },
      }
    }

    throw new Error("Invalid payment type")
  })

const product = z
  .object({
    product_id: z.number().int().nonnegative(),
    name: z.string(),
    amount: z
      .number()
      .int()
      .nonnegative()
      .transform((v) => new AmountValue(v)),
    product_price_id: z.number().int().nonnegative(),
    total: z.number().transform((v) => new CurrencyValue(v)),
  })
  .transform((product) => ({
    productId: product.product_id,
    name: product.name,
    amount: product.amount,
    total: product.total,
    productPriceId: product.product_price_id,
  }))

const schema = z
  .object({
    id: z.number().int().nonnegative(),
    note: z.string().optional(),
    payments: z.array(payment),
    products: z.array(product),
    cancelled_at: z
      .date()
      .or(z.string())
      .nullable()
      .optional()
      .transform((v) => DateTime.fromDBType(v)),
    created_at: z
      .date()
      .or(z.string())
      .transform((v) => DateTime.fromDBType(v)),
    total: z
      .number()
      .nonnegative()
      .transform((v) => new CurrencyValue(v)),
    author_id: z.string().transform((v) => new UUID(v)),
    owner_company_id: z.number().int().nonnegative(),
  })
  .transform((data) => ({
    id: data.id,
    note: data.note,
    payments: data.payments,
    products: data.products,
    cancelledAt: data.cancelled_at,
    createdAt: data.created_at,
    total: data.total,
    authorId: data.author_id,
    ownerCompanyId: data.owner_company_id,
  }))
