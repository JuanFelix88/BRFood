import * as changecase from "change-case"
import { spawn } from "node:child_process"
import path from "node:path"
import fs from "node:fs"

const relativeApiDir = "app/api"
const apiDir = path.join(process.cwd(), relativeApiDir)
const outFilePath = path.join(process.cwd(), `/core/infra/http/routes.ts`)

const routes = []
function matchRoutesInDir(dir = "") {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      matchRoutesInDir(fullPath)
      continue
    }

    if (file.endsWith("route.ts")) {
      const route = fullPath
        .replace(apiDir, "")
        .replace("route.ts", "")
        .replace(/\/index$/, "")
        .replaceAll("\\", "/")
        .replace(/\/$/,"")
      routes.push({
        route: "/api" + route,
        fullPath,
        importRoute: `@/${relativeApiDir}/${fullPath.replace(apiDir, "")
          .replaceAll("\\", "/")}`
          .replace("//", "/")
          .replace(/\.ts$/, ""),
        importName: changecase.pascalCase(route.replace(/(\[)|(\])|\./g, "")),
      })
    }
  }
}

matchRoutesInDir(apiDir)

const importsHeader = routes
  .map(({ importRoute, importName }) => `import * as ${importName} from "${importRoute}"`).join("\n")

const RSs = []
const GETs = []
const POSTs = []
const PUTs = []
const PATCHs = []
const DELETEs = []
const Params = []
const Bodies = []
const Returns = []
const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"]

routes.forEach(
  ({ importName, route, fullPath }) => {
    const filedata = fs.readFileSync(fullPath, 'utf8')

    const supportedNamespaces = [...filedata.matchAll(/export namespace (GET|POST|PATCH|DELETE|PUT)/g)].map(match => match[1]);
    const supportedMethods = [...filedata.matchAll(/export async function (GET|POST|PATCH|DELETE|PUT)/g)].map(match => match[1]);

    supportedMethods.includes("GET") && GETs.push(`"${route}": "${route}"`)
    supportedMethods.includes("POST") && POSTs.push(`"${route}": "${route}"`)
    supportedMethods.includes("PUT") && PUTs.push(`"${route}": "${route}"`)
    supportedMethods.includes("PATCH") && PATCHs.push(`"${route}": "${route}"`)
    supportedMethods.includes("DELETE") && DELETEs.push(`"${route}": "${route}"`)

    Params.push(`"${route}": MethodsObject<${
      methods.map(method => supportedMethods.includes(method) ? `InferParams<typeof ${importName}.${method}>` : "any").join(", ")
    }>`)

    Bodies.push(`"${route}": MethodsObject<${
      methods.map(method => supportedNamespaces.includes(method) ? `${importName}.${method}.Body` : "any").join(", ")
    }>`)

    Returns.push(`"${route}": MethodsObject<${
      methods.map(method => supportedMethods.includes(method) ? `GetResponse<typeof ${importName}.${method}>` : "any").join(", ")
    }>`)
  }
)

const file = `
${importsHeader}

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
  ${RSs.join("\n  ")}
}

export interface GETS {
  ${GETs.join("\n  ")}
}

export interface POSTS {
  ${POSTs.join("\n  ")}
}

export interface PUTS {
  ${PUTs.join("\n  ")}
}

export interface PATCHS {
  ${PATCHs.join("\n  ")}
}

export interface DELETES {
  ${DELETEs.join("\n  ")}
}
  
export interface Params {
  ${Params.join("\n  ")}
  }
  
export interface Bodies {
  ${Bodies.join("\n  ")}
  }
  
export interface Returns {
  ${Returns.join("\n  ")}
}

`.trimStart()

fs.writeFileSync(outFilePath, file)
