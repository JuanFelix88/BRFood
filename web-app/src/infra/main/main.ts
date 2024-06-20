import { AcceptCompanyTransferOwner } from "@/src/application/usecases/accept-company-transfer-owner"
import { AddPaymentMethod } from "@/src/application/usecases/add-payment-method"
import { AddProduct } from "@/src/application/usecases/add-product"
import { AddPurchase } from "@/src/application/usecases/add-purchase"
import { AddRawMaterial } from "@/src/application/usecases/add-raw-material"
import { AddSale } from "@/src/application/usecases/add-sale"
import { CancelSale } from "@/src/application/usecases/cancel-sale"
import { DeclineCompanyTransferOwner } from "@/src/application/usecases/decline-company-transfer-owner"
import { DeleteCompanyTransferOwner } from "@/src/application/usecases/delete-company-transfer-owner"
import { DeletePaymentMethodById } from "@/src/application/usecases/delete-payment-method-by-id"
import { DeleteProductById } from "@/src/application/usecases/delete-product-by-id"
import { GetCompanyById } from "@/src/application/usecases/get-company-by-id"
import { GetCompanySales } from "@/src/application/usecases/get-company-sales"
import { GetPaymentMethodsByCompanyId } from "@/src/application/usecases/get-payment-methods-by-company-id"
import { GetProductById } from "@/src/application/usecases/get-product-by-id"
import { GetProductsByCompanyId } from "@/src/application/usecases/get-products-by-company-id"
import { GetProductsByUserId } from "@/src/application/usecases/get-products-by-user-id"
import { GetUserById } from "@/src/application/usecases/get-user-by-id"
import { GetUserPendingCompanyOwnerTransferReceived } from "@/src/application/usecases/get-user-pending-company-owner-transfer-received"
import { RequestUpdateOwnerCompany } from "@/src/application/usecases/request-update-owner-company"
import { SigninUser } from "@/src/application/usecases/signin-user"
import { SignupUser } from "@/src/application/usecases/signup-user"
import { Template } from "@/src/application/usecases/template"
import { UpdateCompany } from "@/src/application/usecases/update-company"
import { UpdatePaymentMethod } from "@/src/application/usecases/update-payment-method"
import { UpdateProduct } from "@/src/application/usecases/update-product"
import { UploadImageToBucket } from "@/src/application/usecases/upload-image-to-bucket"
import { vercelFactory } from "../factories/vercel"

// Context to Vercel App
const to = vercelFactory
console.time("construct1")

class Main {
  constructor(
    public readonly acceptCompanyTransferOwner: AcceptCompanyTransferOwner,
    public readonly addPaymentMethod: AddPaymentMethod,
    public readonly addProduct: AddProduct,
    public readonly addPurchase: AddPurchase,
    public readonly addRawMaterial: AddRawMaterial,
    public readonly addSale: AddSale,
    public readonly cancelSale: CancelSale,
    public readonly declineCompanyTransferOwner: DeclineCompanyTransferOwner,
    public readonly deleteCompanyTransferOwner: DeleteCompanyTransferOwner,
    public readonly deletePaymentMethodById: DeletePaymentMethodById,
    public readonly deleteProductById: DeleteProductById,
    public readonly getCompanyById: GetCompanyById,
    public readonly getCompanySales: GetCompanySales,
    public readonly getPaymentMethodsByCompanyId: GetPaymentMethodsByCompanyId,
    public readonly getProductById: GetProductById,
    public readonly getProductsByCompanyId: GetProductsByCompanyId,
    public readonly getProductsByUserId: GetProductsByUserId,
    public readonly getUserById: GetUserById,
    public readonly getUserPendingCompanyOwnerTransferReceived: GetUserPendingCompanyOwnerTransferReceived,
    public readonly requestUpdateOwnerCompany: RequestUpdateOwnerCompany,
    public readonly signinUser: SigninUser,
    public readonly signupUser: SignupUser,
    public readonly template: Template,
    public readonly updateCompany: UpdateCompany,
    public readonly updatePaymentMethod: UpdatePaymentMethod,
    public readonly updateProduct: UpdateProduct,
    public readonly uploadImageToBucket: UploadImageToBucket
  ) {}
}

export const BRFood = to.construct(Main)

console.timeEnd("construct1")
console.timeEnd("vercel")
