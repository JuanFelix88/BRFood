import { Product } from "@/src/application/entities/Product/Product"
import { ProductErrors } from "@/src/application/errors/product"
import { ProductRepository } from "@/src/application/repositories/product-repository"
import { PostgresService } from "@/src/infra/services/postgres"
import { ProductMapper } from "../mappers/product-mapper"

export class PostgresProductRepository implements ProductRepository {
  public async get(id: number): Promise<Product> {
    const { rows: rowsProduct } = await PostgresService.query<{
      id: number
      name: string
      price: string
      profit: string
      owner_company_id: number
      created_at: Date
      updated_at: Date
    }>(
      `--sql
      WITH product_prices_with_row_number AS (
        SELECT 
          prices.*, 
          ROW_NUMBER() OVER(PARTITION BY product_id ORDER BY id DESC) as rn
        FROM public.product_prices prices
        WHERE prices.product_id = $1
        ORDER BY prices.created_at DESC
      )

      SELECT
        products.id,
        products.name,
        prices.price,
        prices.profit,
        products.owner_company_id,
        products.created_at,
        products.updated_at
      FROM public.products products
        INNER JOIN product_prices_with_row_number prices 
          ON products.id = prices.product_id AND prices.rn = 1
      WHERE products.id = $1
    `,
      [id],
    )

    if (rowsProduct.length === 0) {
      throw new ProductErrors.ProductNotFound()
    }

    return ProductMapper.toDomain({
      id: rowsProduct[0].id,
      name: rowsProduct[0].name,
      price: rowsProduct[0].price,
      profit: rowsProduct[0].profit,
      owner_company_id: rowsProduct[0].owner_company_id,
      updated_at: rowsProduct[0].updated_at,
      created_at: rowsProduct[0].created_at,
    })
  }

  public async add(payload: ProductRepository.AddPayload): Promise<Product> {
    using client = await PostgresService.connect()

    try {
      await client.query("BEGIN")
      const { rows: rowsCreateProduct } = await client.query<{
        id: number
        name: string
        owner_company_id: number
        created_at: Date
        updated_at: Date
      }>(
        `--sql 
          INSERT INTO public.products(name, author_id, owner_company_id)  
          VALUES ($1, $2, $3)
          RETURNING 
            id,
            name,
            owner_company_id,
            created_at,
            updated_at
        `,
        [payload.name, payload.authorId.toString(), payload.ownerCompanyId],
      )

      const productId: number | undefined = rowsCreateProduct[0]?.id

      if (productId === undefined) {
        throw new ProductErrors.ProductNotCreated()
      }

      const { rows: rowsCreateProductPrice } = await client.query<{
        product_id: number
        price: string
        profit: string
      }>(
        `--sql
          INSERT INTO public.product_prices(product_id, price, profit)
          VALUES ($1, $2, $3)
          RETURNING product_id, price, profit
        `,
        [productId, payload.price.int, payload.profit.int],
      )

      if (rowsCreateProductPrice.length === 0) {
        throw new ProductErrors.ProductNotCreated()
      }

      await client.query("COMMIT")

      return ProductMapper.toDomain({
        id: rowsCreateProduct[0].id,
        name: rowsCreateProduct[0].name,
        price: rowsCreateProductPrice[0].price,
        owner_company_id: rowsCreateProduct[0].owner_company_id,
        profit: rowsCreateProductPrice[0].profit,
        updated_at: rowsCreateProduct[0].updated_at,
        created_at: rowsCreateProduct[0].created_at,
      })
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    }
  }

  public async update(
    productId: number,
    payload: ProductRepository.UpdatePayload,
  ): Promise<Product> {
    using client = await PostgresService.connect()

    try {
      await client.query("BEGIN")

      const product = await this.get(productId)

      const isChangedPriceProfit =
        !product.lastPrice.isEqual(payload.price) ||
        !product.lastProfit.isEqual(payload.profit)

      const queryProductPrices = isChangedPriceProfit
        ? `--sql
          INSERT INTO public.product_prices(product_id, price, profit)
          VALUES ($1, $2, $3)
          RETURNING product_id, price, profit`
        : `--sql
          SELECT id, price, profit
          FROM public.product_prices
          WHERE product_id = $1
          ORDER BY created_at DESC
          LIMIT 1`

      const queryValues = isChangedPriceProfit
        ? [productId, payload.price.int, payload.profit.int]
        : [productId]

      const { rows: rowsProductPrices } = await client.query<{
        id: number
        price: string
        profit: string
      }>(queryProductPrices, queryValues)

      if (rowsProductPrices.length === 0) {
        throw new ProductErrors.ProductNotUpdated()
      }

      const { rows: rowProductUpdated } = await client.query<{
        id: number
        name: string
        owner_company_id: number
        created_at: Date
        updated_at: Date
      }>(
        `--sql
        UPDATE public.products SET 
          name = $1,
          updated_at = NOW()
        WHERE id = $2
        RETURNING 
          id, 
          name, 
          owner_company_id, 
          updated_at, 
          created_at
        `,
        [payload.name, productId],
      )

      if (rowProductUpdated.length === 0) {
        throw new ProductErrors.ProductNotUpdated()
      }

      await client.query("COMMIT")

      return ProductMapper.toDomain({
        id: rowProductUpdated[0].id,
        name: rowProductUpdated[0].name,
        price: rowsProductPrices[0].price,
        owner_company_id: rowProductUpdated[0].owner_company_id,
        profit: rowsProductPrices[0].profit,
        updated_at: rowProductUpdated[0].updated_at,
        created_at: rowProductUpdated[0].created_at,
      })
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    }
  }

  public async getByIds(ids: { productId: number }[]): Promise<Product[]> {
    if (ids.some(({ productId }) => typeof productId !== "number")) {
      throw new ProductErrors.InvalidInputProductsIds()
    }

    const productIds: string = ids.map(({ productId }) => productId).join(", ")

    const { rows: rowsListProducts } = await PostgresService.query<{
      id: number
      name: string
      price: string
      profit: string
      owner_company_id: number
      updated_at: Date
      created_at: Date
    }>(`--sql
      WITH product_prices_with_row_number AS (
        SELECT 
          prices.*, 
          ROW_NUMBER() OVER(PARTITION BY product_id ORDER BY id DESC) as rn
        FROM public.product_prices prices
        WHERE prices.product_id IN (${productIds})
        ORDER BY prices.created_at DESC
      )
      
      SELECT 
        products.id,
        products.name,
        prices.price,
        prices.profit,
        prices.owner_company_id,
        prices.updated_at,
        prices.created_at
      FROM public.products products
        INNER JOIN product_prices_with_row_number prices 
          ON prices.product_id = products.id AND prices.rn = 1
      WHERE products.id IN (${productIds})
    `)

    return rowsListProducts.map(ProductMapper.toDomain)
  }

  public async getByCompanyId(companyId: number): Promise<Product[]> {
    const { rows: rowsListProducts } = await PostgresService.query<{
      id: number
      name: string
      price: string
      profit: string
      owner_company_id: number
      updated_at: Date
      created_at: Date
    }>(
      `--sql
      WITH product_prices_with_row_number AS (
        SELECT 
          prices.*, 
          ROW_NUMBER() OVER(PARTITION BY product_id ORDER BY id DESC) as rn
        FROM public.product_prices prices
        ORDER BY prices.created_at DESC
      )

      SELECT 
        products.id,
        products.name,
        prices.price,
        prices.profit,
        products.owner_company_id,
        products.updated_at,
        products.created_at
      FROM public.products products
        INNER JOIN product_prices_with_row_number prices 
          ON prices.product_id = products.id AND prices.rn = 1
      WHERE products.owner_company_id = $1
    `,
      [companyId],
    )

    return rowsListProducts.map(ProductMapper.toDomain)
  }

  public async listByUserIdRelativeToOwnerCompany(
    userId: string,
  ): Promise<Product[]> {
    console.time("sql")
    const { rows: rowsListProducts } = await PostgresService.query<{
      id: number
      name: string
      price: string
      profit: string
      owner_company_id: number
      updated_at: Date
      created_at: Date
    }>(
      `--sql
      WITH product_prices_with_row_number AS (
        SELECT 
          prices.*, 
          ROW_NUMBER() OVER(PARTITION BY product_id ORDER BY id DESC) as rn
        FROM public.product_prices prices
        ORDER BY prices.created_at DESC
      )
      
      SELECT 
        products.id,
        products.name,
        prices.price,
        prices.profit,
        products.owner_company_id,
        products.updated_at,
        products.created_at
      FROM public.products products
        INNER JOIN product_prices_with_row_number prices 
          ON prices.product_id = products.id 
            AND prices.rn = 1 
        INNER JOIN public.company_authorized_users authorized_users 
          ON authorized_users.company_id = products.owner_company_id 
            AND authorized_users.user_id = $1
      `,
      [userId],
    )
    console.timeEnd("sql")

    return rowsListProducts.map(ProductMapper.toDomain)
  }

  public async delete(productId: number): Promise<void> {
    const { rowCount } = await PostgresService.query(
      `--sql
      DELETE FROM public.products WHERE id = $1  
    `,
      [productId],
    )

    if (rowCount === 0) {
      throw new ProductErrors.ProductNotFound()
    }
  }
}
