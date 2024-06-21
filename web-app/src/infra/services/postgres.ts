import { PostgresErrors } from "@/src/application/errors/postgres"
import { StaticClass } from "@/src/shared/utils/static-class"
import { Pool, PoolClient, QueryResultRow } from "pg"

export enum PostgresTypes {
  BOOL = 16,
  BYTEA = 17,
  CHAR = 18,
  INT8 = 20,
  INT2 = 21,
  INT4 = 23,
  REGPROC = 24,
  TEXT = 25,
  OID = 26,
  TID = 27,
  XID = 28,
  CID = 29,
  JSON = 114,
  XML = 142,
  PG_NODE_TREE = 194,
  SMGR = 210,
  PATH = 602,
  POLYGON = 604,
  CIDR = 650,
  FLOAT4 = 700,
  FLOAT8 = 701,
  ABSTIME = 702,
  RELTIME = 703,
  TINTERVAL = 704,
  CIRCLE = 718,
  MACADDR8 = 774,
  MONEY = 790,
  MACADDR = 829,
  INET = 869,
  ACLITEM = 1033,
  BPCHAR = 1042,
  VARCHAR = 1043,
  DATE = 1082,
  TIME = 1083,
  TIMESTAMP = 1114,
  TIMESTAMPTZ = 1184,
  INTERVAL = 1186,
  TIMETZ = 1266,
  BIT = 1560,
  VARBIT = 1562,
  NUMERIC = 1700,
  REFCURSOR = 1790,
  REGPROCEDURE = 2202,
  REGOPER = 2203,
  REGOPERATOR = 2204,
  REGCLASS = 2205,
  REGTYPE = 2206,
  UUID = 2950,
  TXID_SNAPSHOT = 2970,
  PG_LSN = 3220,
  PG_NDISTINCT = 3361,
  PG_DEPENDENCIES = 3402,
  TSVECTOR = 3614,
  TSQUERY = 3615,
  GTSVECTOR = 3642,
  REGCONFIG = 3734,
  REGDICTIONARY = 3769,
  JSONB = 3802,
  REGNAMESPACE = 4089,
  REGROLE = 4096,
}

if (
  [
    process.env.POSTGRES_HOST,
    process.env.POSTGRES_PORT,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    process.env.POSTGRES_DATABASE,
  ].some((i) => !i)
) {
  throw new PostgresErrors.MissingEnvVarsError()
}

function getTypeParser(type: PostgresTypes) {
  return (data: string | Buffer) => {
    if (type === PostgresTypes.NUMERIC) {
      return Number(data.toString())
    }

    if (type === PostgresTypes.INT8) {
      return Number(data.toString())
    }

    if (type === PostgresTypes.INT4) {
      return Number(data.toString())
    }

    if (type === PostgresTypes.INT2) {
      return Number(data.toString())
    }

    return data
  }
}

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  keepAlive: true,
  idleTimeoutMillis: 15_000,
  max: 5,
  min: 1,
  types: { getTypeParser },
})

export class PostgresService extends StaticClass {
  public static service: PostgresService
  public static counter = 0
  public connected: boolean = false

  public static async connect() {
    return new PostgresService(await pool.connect())
  }

  public static async query<T extends QueryResultRow = any>(
    query: string,
    values?: (string | number | boolean)[],
  ) {
    return pool.query<T>(query, values)
  }

  private constructor(private client: PoolClient) {
    super()
  }

  public get() {
    return this.client
  }

  public async query<T extends QueryResultRow = any>(
    query: string,
    values?: (string | number | boolean | undefined | null)[],
  ) {
    return await this.client!.query<T>(query, values)
  }

  private async connect(): Promise<PostgresService> {
    if (this.connected) {
      return this
    }

    await this.client.connect()
    this.connected = true
    return this
  }

  public disconnect() {
    this.connected = false
    this.client.release(true)
  }

  [Symbol.dispose]() {
    this.disconnect()
  }
}
