import { AcceptCompanyTransferOwner } from "@/core/application/usecases/accept-company-transfer-owner"
import { AddAuthorizedUsersToCompany } from "@/core/application/usecases/add-authorized-users-to-company"
import { AddCompany } from "@/core/application/usecases/add-company"
import { AddPaymentMethod } from "@/core/application/usecases/add-payment-method"
import { AddProduct } from "@/core/application/usecases/add-product"
import { AddPurchase } from "@/core/application/usecases/add-purchase"
import { AddRawMaterial } from "@/core/application/usecases/add-raw-material"
import { AddSale } from "@/core/application/usecases/add-sale"
import { CancelSale } from "@/core/application/usecases/cancel-sale"
import { DeclineCompanyTransferOwner } from "@/core/application/usecases/decline-company-transfer-owner"
import { DeleteCompanyTransferOwner } from "@/core/application/usecases/delete-company-transfer-owner"
import { DeletePaymentMethodById } from "@/core/application/usecases/delete-payment-method-by-id"
import { DeleteProductById } from "@/core/application/usecases/delete-product-by-id"
import { GetCompaniesByUser } from "@/core/application/usecases/get-companies-by-user"
import { GetCompanyById } from "@/core/application/usecases/get-company-by-id"
import { GetCompanySales } from "@/core/application/usecases/get-company-sales"
import { GetPaymentMethodWithFees } from "@/core/application/usecases/get-payment-method-with-fees"
import { GetPaymentMethodsByCompanyId } from "@/core/application/usecases/get-payment-methods-by-company-id"
import { GetProductById } from "@/core/application/usecases/get-product-by-id"
import { GetProductsByCompanyId } from "@/core/application/usecases/get-products-by-company-id"
import { GetProductsByUserId } from "@/core/application/usecases/get-products-by-user-id"
import { GetUserById } from "@/core/application/usecases/get-user-by-id"
import { GetUserPendingCompanyOwnerTransferReceived } from "@/core/application/usecases/get-user-pending-company-owner-transfer-received"
import { RequestUpdateOwnerCompany } from "@/core/application/usecases/request-update-owner-company"
import { SigninUser } from "@/core/application/usecases/signin-user"
import { SignupUser } from "@/core/application/usecases/signup-user"
import { Template } from "@/core/application/usecases/template"
import { UpdateCompany } from "@/core/application/usecases/update-company"
import { UpdatePaymentMethod } from "@/core/application/usecases/update-payment-method"
import { UpdateProduct } from "@/core/application/usecases/update-product"
import { UploadImageToBucket } from "@/core/application/usecases/upload-image-to-bucket"
import { vercelFactory } from "../factories/vercel"

// Context to Vercel App
const to = vercelFactory
console.time("construct1")

class Main {
  constructor(
    public readonly acceptCompanyTransferOwner: AcceptCompanyTransferOwner,
    public readonly addAuthorizedUsersToCompany: AddAuthorizedUsersToCompany,
    public readonly addCompany: AddCompany,
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
    public readonly getCompaniesByUser: GetCompaniesByUser,
    public readonly getCompanyById: GetCompanyById,
    public readonly getCompanySales: GetCompanySales,
    public readonly getPaymentMethodWithFees: GetPaymentMethodWithFees,
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
