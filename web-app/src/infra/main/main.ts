import { AddPaymentMethod } from "@/src/application/usecases/add-payment-method"
import { AddProduct } from "@/src/application/usecases/add-product"
import { AddPurchase } from "@/src/application/usecases/add-purchase"
import { AddRawMaterial } from "@/src/application/usecases/add-raw-material"
import { AddSale } from "@/src/application/usecases/add-sale"
import { DeleteProductById } from "@/src/application/usecases/delete-product-by-id"
import { GetCompanyById } from "@/src/application/usecases/get-company-by-id"
import { GetProductById } from "@/src/application/usecases/get-product-by-id"
import { GetProductsByCompanyId } from "@/src/application/usecases/get-products-by-company-id"
import { GetProductsByUserId } from "@/src/application/usecases/get-products-by-user-id"
import { GetUserById } from "@/src/application/usecases/get-user-by-id"
import { SignInUser } from "@/src/application/usecases/signin-user"
import { SignUpUser } from "@/src/application/usecases/signup-user"
import { UpdateProduct } from "@/src/application/usecases/update-product"
import { UploadImageToBucket } from "@/src/application/usecases/upload-image-to-bucket"
import { vercelFactory } from "../factories/vercel"
import { GetPaymentMethodsByCompanyId } from "@/src/application/usecases/get-payment-methods-by-company-id"
import { UpdatePaymentMethod } from "@/src/application/usecases/update-payment-method"
import { DeletePaymentMethodById } from "@/src/application/usecases/delete-payment-method-by-id"

// Context to Vercel App
const to = vercelFactory

export namespace BRFood {
  export const addSale = to.inject(AddSale)
  export const addPurchase = to.inject(AddPurchase)
  export const addRawMaterial = to.inject(AddRawMaterial)
  export const addProduct = to.inject(AddProduct)
  export const addPaymentMethod = to.inject(AddPaymentMethod)
  export const updateProduct = to.inject(UpdateProduct)
  export const getCompanyById = to.inject(GetCompanyById)
  export const getUserById = to.inject(GetUserById)
  export const getProductsByUserId = to.inject(GetProductsByUserId)
  export const getPaymentMethodsByCompanyId = to.inject(
    GetPaymentMethodsByCompanyId,
  )
  export const signinUser = to.inject(SignInUser)
  export const signUpUser = to.inject(SignUpUser)
  export const uploadImageToBucket = to.inject(UploadImageToBucket)
  export const updatePaymentMethod = to.inject(UpdatePaymentMethod)
  export const getProductsByCompanyId = to.inject(GetProductsByCompanyId)
  export const getProductById = to.inject(GetProductById)
  export const deleteProductById = to.inject(DeleteProductById)
  export const deletePaymentMethodBy = to.inject(DeletePaymentMethodById)
}
