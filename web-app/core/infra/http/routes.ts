import * as Test from "@/app/api/test/route"
import * as V1AuthSignin from "@/app/api/v1/auth/signin/route"
import * as V1AuthSignup from "@/app/api/v1/auth/signup/route"
import * as V1Companies from "@/app/api/v1/companies/route"
import * as V1CompaniesCompanyIdAuthorizedUsers from "@/app/api/v1/companies/[company_id]/authorized-users/route"
import * as V1CompaniesCompanyIdOwnerOwnerEmail from "@/app/api/v1/companies/[company_id]/owner/[owner_email]/route"
import * as V1CompaniesCompanyIdPaymentMethods from "@/app/api/v1/companies/[company_id]/payment-methods/route"
import * as V1CompaniesCompanyIdProducts from "@/app/api/v1/companies/[company_id]/products/route"
import * as V1CompaniesCompanyId from "@/app/api/v1/companies/[company_id]/route"
import * as V1CompaniesCompanyIdSales from "@/app/api/v1/companies/[company_id]/sales/route"
import * as V1CompanyTransferOwnersReceived from "@/app/api/v1/company-transfer-owners/received/route"
import * as V1CompanyTransferOwnersReceivedTransferId from "@/app/api/v1/company-transfer-owners/received/[transfer_id]/route"
import * as V1CompanyTransferOwnersTransferId from "@/app/api/v1/company-transfer-owners/[transfer_id]/route"
import * as V1PaymentMethodsPaymentMethodId from "@/app/api/v1/payment-methods/[payment_method_id]/route"
import * as V1PaymentMethodsPaymentMethodIdWithFees from "@/app/api/v1/payment-methods/[payment_method_id]/with-fees/route"
import * as V1Products from "@/app/api/v1/products/route"
import * as V1ProductsProductId from "@/app/api/v1/products/[product_id]/route"
import * as V1SalesSaleId from "@/app/api/v1/sales/[sale_id]/route"

import type { NextRequest, NextResponse } from 'next/server'
export type MethodsObject<GET, POST, PUT, PATCH, DELETE> = { 
  GET: GET; POST: POST; PUT: PUT; PATCH: PATCH; DELETE: DELETE 
}
export type GetOfGet<T>    = T extends MethodsObject<infer R, unknown, unknown, unknown, unknown> ? R : never
export type GetOfPost<T>   = T extends MethodsObject<unknown, infer R, unknown, unknown, unknown> ? R : never
export type GetOfPut<T>    = T extends MethodsObject<unknown, unknown, infer R, unknown, unknown> ? R : never
export type GetOfPatch<T>  = T extends MethodsObject<unknown, unknown, unknown, infer R, unknown> ? R : never
export type GetOfDelete<T> = T extends MethodsObject<unknown, unknown, unknown, unknown, infer R> ? R : never
type InferParams<T> = T extends (first: NextRequest, second: { params: infer R }) => unknown ? { [T in keyof R]: number | string | boolean } : undefined
export type GetResponse<T extends (...args: any) => any> = ReturnType<T> extends Promise<NextResponse<infer J>> ? J : never

export interface RS {
  
}

export interface GETS {
  "/api/test": "/api/test"
  "/api/v1/companies": "/api/v1/companies"
  "/api/v1/companies/[company_id]/payment-methods": "/api/v1/companies/[company_id]/payment-methods"
  "/api/v1/companies/[company_id]/products": "/api/v1/companies/[company_id]/products"
  "/api/v1/companies/[company_id]": "/api/v1/companies/[company_id]"
  "/api/v1/companies/[company_id]/sales": "/api/v1/companies/[company_id]/sales"
  "/api/v1/company-transfer-owners/received": "/api/v1/company-transfer-owners/received"
  "/api/v1/payment-methods/[payment_method_id]/with-fees": "/api/v1/payment-methods/[payment_method_id]/with-fees"
  "/api/v1/products": "/api/v1/products"
  "/api/v1/products/[product_id]": "/api/v1/products/[product_id]"
}

export interface POSTS {
  "/api/v1/auth/signin": "/api/v1/auth/signin"
  "/api/v1/auth/signup": "/api/v1/auth/signup"
  "/api/v1/companies": "/api/v1/companies"
  "/api/v1/companies/[company_id]/authorized-users": "/api/v1/companies/[company_id]/authorized-users"
  "/api/v1/companies/[company_id]/payment-methods": "/api/v1/companies/[company_id]/payment-methods"
  "/api/v1/companies/[company_id]/products": "/api/v1/companies/[company_id]/products"
  "/api/v1/companies/[company_id]/sales": "/api/v1/companies/[company_id]/sales"
  "/api/v1/products": "/api/v1/products"
}

export interface PUTS {
  "/api/v1/companies/[company_id]/owner/[owner_email]": "/api/v1/companies/[company_id]/owner/[owner_email]"
  "/api/v1/companies/[company_id]": "/api/v1/companies/[company_id]"
  "/api/v1/payment-methods/[payment_method_id]": "/api/v1/payment-methods/[payment_method_id]"
  "/api/v1/products/[product_id]": "/api/v1/products/[product_id]"
}

export interface PATCHS {
  "/api/v1/company-transfer-owners/received/[transfer_id]": "/api/v1/company-transfer-owners/received/[transfer_id]"
}

export interface DELETES {
  "/api/v1/company-transfer-owners/received/[transfer_id]": "/api/v1/company-transfer-owners/received/[transfer_id]"
  "/api/v1/company-transfer-owners/[transfer_id]": "/api/v1/company-transfer-owners/[transfer_id]"
  "/api/v1/payment-methods/[payment_method_id]": "/api/v1/payment-methods/[payment_method_id]"
  "/api/v1/products/[product_id]": "/api/v1/products/[product_id]"
  "/api/v1/sales/[sale_id]": "/api/v1/sales/[sale_id]"
}
  
export interface Params {
  "/api/test": MethodsObject<InferParams<typeof Test.GET>, any, any, any, any>
  "/api/v1/auth/signin": MethodsObject<any, InferParams<typeof V1AuthSignin.POST>, any, any, any>
  "/api/v1/auth/signup": MethodsObject<any, InferParams<typeof V1AuthSignup.POST>, any, any, any>
  "/api/v1/companies": MethodsObject<InferParams<typeof V1Companies.GET>, InferParams<typeof V1Companies.POST>, any, any, any>
  "/api/v1/companies/[company_id]/authorized-users": MethodsObject<any, InferParams<typeof V1CompaniesCompanyIdAuthorizedUsers.POST>, any, any, any>
  "/api/v1/companies/[company_id]/owner/[owner_email]": MethodsObject<any, any, InferParams<typeof V1CompaniesCompanyIdOwnerOwnerEmail.PUT>, any, any>
  "/api/v1/companies/[company_id]/payment-methods": MethodsObject<InferParams<typeof V1CompaniesCompanyIdPaymentMethods.GET>, InferParams<typeof V1CompaniesCompanyIdPaymentMethods.POST>, any, any, any>
  "/api/v1/companies/[company_id]/products": MethodsObject<InferParams<typeof V1CompaniesCompanyIdProducts.GET>, InferParams<typeof V1CompaniesCompanyIdProducts.POST>, any, any, any>
  "/api/v1/companies/[company_id]": MethodsObject<InferParams<typeof V1CompaniesCompanyId.GET>, any, InferParams<typeof V1CompaniesCompanyId.PUT>, any, any>
  "/api/v1/companies/[company_id]/sales": MethodsObject<InferParams<typeof V1CompaniesCompanyIdSales.GET>, InferParams<typeof V1CompaniesCompanyIdSales.POST>, any, any, any>
  "/api/v1/company-transfer-owners/received": MethodsObject<InferParams<typeof V1CompanyTransferOwnersReceived.GET>, any, any, any, any>
  "/api/v1/company-transfer-owners/received/[transfer_id]": MethodsObject<any, any, any, InferParams<typeof V1CompanyTransferOwnersReceivedTransferId.PATCH>, InferParams<typeof V1CompanyTransferOwnersReceivedTransferId.DELETE>>
  "/api/v1/company-transfer-owners/[transfer_id]": MethodsObject<any, any, any, any, InferParams<typeof V1CompanyTransferOwnersTransferId.DELETE>>
  "/api/v1/payment-methods/[payment_method_id]": MethodsObject<any, any, InferParams<typeof V1PaymentMethodsPaymentMethodId.PUT>, any, InferParams<typeof V1PaymentMethodsPaymentMethodId.DELETE>>
  "/api/v1/payment-methods/[payment_method_id]/with-fees": MethodsObject<InferParams<typeof V1PaymentMethodsPaymentMethodIdWithFees.GET>, any, any, any, any>
  "/api/v1/products": MethodsObject<InferParams<typeof V1Products.GET>, InferParams<typeof V1Products.POST>, any, any, any>
  "/api/v1/products/[product_id]": MethodsObject<InferParams<typeof V1ProductsProductId.GET>, any, InferParams<typeof V1ProductsProductId.PUT>, any, InferParams<typeof V1ProductsProductId.DELETE>>
  "/api/v1/sales/[sale_id]": MethodsObject<any, any, any, any, InferParams<typeof V1SalesSaleId.DELETE>>
  }
  
export interface Bodies {
  "/api/test": MethodsObject<any, any, any, any, any>
  "/api/v1/auth/signin": MethodsObject<any, V1AuthSignin.POST.Body, any, any, any>
  "/api/v1/auth/signup": MethodsObject<any, V1AuthSignup.POST.Body, any, any, any>
  "/api/v1/companies": MethodsObject<any, V1Companies.POST.Body, any, any, any>
  "/api/v1/companies/[company_id]/authorized-users": MethodsObject<any, V1CompaniesCompanyIdAuthorizedUsers.POST.Body, any, any, any>
  "/api/v1/companies/[company_id]/owner/[owner_email]": MethodsObject<any, any, any, any, any>
  "/api/v1/companies/[company_id]/payment-methods": MethodsObject<any, V1CompaniesCompanyIdPaymentMethods.POST.Body, any, any, any>
  "/api/v1/companies/[company_id]/products": MethodsObject<any, V1CompaniesCompanyIdProducts.POST.Body, any, any, any>
  "/api/v1/companies/[company_id]": MethodsObject<any, any, V1CompaniesCompanyId.PUT.Body, any, any>
  "/api/v1/companies/[company_id]/sales": MethodsObject<any, V1CompaniesCompanyIdSales.POST.Body, any, any, any>
  "/api/v1/company-transfer-owners/received": MethodsObject<any, any, any, any, any>
  "/api/v1/company-transfer-owners/received/[transfer_id]": MethodsObject<any, any, any, any, any>
  "/api/v1/company-transfer-owners/[transfer_id]": MethodsObject<any, any, any, any, any>
  "/api/v1/payment-methods/[payment_method_id]": MethodsObject<any, any, V1PaymentMethodsPaymentMethodId.PUT.Body, any, any>
  "/api/v1/payment-methods/[payment_method_id]/with-fees": MethodsObject<any, any, any, any, any>
  "/api/v1/products": MethodsObject<any, V1Products.POST.Body, any, any, any>
  "/api/v1/products/[product_id]": MethodsObject<any, any, V1ProductsProductId.PUT.Body, any, any>
  "/api/v1/sales/[sale_id]": MethodsObject<any, any, any, any, any>
  }
  
export interface Returns {
  "/api/test": MethodsObject<GetResponse<typeof Test.GET>, any, any, any, any>
  "/api/v1/auth/signin": MethodsObject<any, GetResponse<typeof V1AuthSignin.POST>, any, any, any>
  "/api/v1/auth/signup": MethodsObject<any, GetResponse<typeof V1AuthSignup.POST>, any, any, any>
  "/api/v1/companies": MethodsObject<GetResponse<typeof V1Companies.GET>, GetResponse<typeof V1Companies.POST>, any, any, any>
  "/api/v1/companies/[company_id]/authorized-users": MethodsObject<any, GetResponse<typeof V1CompaniesCompanyIdAuthorizedUsers.POST>, any, any, any>
  "/api/v1/companies/[company_id]/owner/[owner_email]": MethodsObject<any, any, GetResponse<typeof V1CompaniesCompanyIdOwnerOwnerEmail.PUT>, any, any>
  "/api/v1/companies/[company_id]/payment-methods": MethodsObject<GetResponse<typeof V1CompaniesCompanyIdPaymentMethods.GET>, GetResponse<typeof V1CompaniesCompanyIdPaymentMethods.POST>, any, any, any>
  "/api/v1/companies/[company_id]/products": MethodsObject<GetResponse<typeof V1CompaniesCompanyIdProducts.GET>, GetResponse<typeof V1CompaniesCompanyIdProducts.POST>, any, any, any>
  "/api/v1/companies/[company_id]": MethodsObject<GetResponse<typeof V1CompaniesCompanyId.GET>, any, GetResponse<typeof V1CompaniesCompanyId.PUT>, any, any>
  "/api/v1/companies/[company_id]/sales": MethodsObject<GetResponse<typeof V1CompaniesCompanyIdSales.GET>, GetResponse<typeof V1CompaniesCompanyIdSales.POST>, any, any, any>
  "/api/v1/company-transfer-owners/received": MethodsObject<GetResponse<typeof V1CompanyTransferOwnersReceived.GET>, any, any, any, any>
  "/api/v1/company-transfer-owners/received/[transfer_id]": MethodsObject<any, any, any, GetResponse<typeof V1CompanyTransferOwnersReceivedTransferId.PATCH>, GetResponse<typeof V1CompanyTransferOwnersReceivedTransferId.DELETE>>
  "/api/v1/company-transfer-owners/[transfer_id]": MethodsObject<any, any, any, any, GetResponse<typeof V1CompanyTransferOwnersTransferId.DELETE>>
  "/api/v1/payment-methods/[payment_method_id]": MethodsObject<any, any, GetResponse<typeof V1PaymentMethodsPaymentMethodId.PUT>, any, GetResponse<typeof V1PaymentMethodsPaymentMethodId.DELETE>>
  "/api/v1/payment-methods/[payment_method_id]/with-fees": MethodsObject<GetResponse<typeof V1PaymentMethodsPaymentMethodIdWithFees.GET>, any, any, any, any>
  "/api/v1/products": MethodsObject<GetResponse<typeof V1Products.GET>, GetResponse<typeof V1Products.POST>, any, any, any>
  "/api/v1/products/[product_id]": MethodsObject<GetResponse<typeof V1ProductsProductId.GET>, any, GetResponse<typeof V1ProductsProductId.PUT>, any, GetResponse<typeof V1ProductsProductId.DELETE>>
  "/api/v1/sales/[sale_id]": MethodsObject<any, any, any, any, GetResponse<typeof V1SalesSaleId.DELETE>>
}

