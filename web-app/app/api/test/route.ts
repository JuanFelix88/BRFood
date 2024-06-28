import { PostgresService } from "@/core/infra/services"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { rows } = await PostgresService.query(`--sql
    WITH others as (
      SELECT *
      FROM company_client_credits
    )

    SELECT 
      company_client_credits.id, 
      json_agg(
        json_build_object(
          'id', others.id,
          'credit', others.credit
        )
      ) as list 
      FROM company_client_credits 
        INNER JOIN others ON others.id IS NOT NULL
      GROUP BY company_client_credits.id
  `)

  return NextResponse.json(rows as object[])
}

export async function ALIENIGENA(req: NextRequest) {
  const { rows } = await PostgresService.query(`--sql
    WITH others as (
      SELECT *
      FROM company_client_credits
    )

    SELECT 
      company_client_credits.id, 
      json_agg(
        json_build_object(
          'id', others.id,
          'credit', others.credit
        )
      ) as list 
      FROM company_client_credits 
        INNER JOIN others ON others.id IS NOT NULL
      GROUP BY company_client_credits.id
  `)

  return NextResponse.json(rows)
}
