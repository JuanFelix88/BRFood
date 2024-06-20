import * as changecase from "change-case"
import { spawn } from "node:child_process"
import path from 'node:path'
import fs from "node:fs"

const usecases = `${process.cwd()}/src/application/usecases`
const template = fs.readFileSync(`${usecases}/template.ts`, "utf-8")
const name = process.argv[2]

const entityName = changecase.pascalCase(name)
const filename = changecase.kebabCase(name)

console.log(process.env)

const destFile = `${usecases}/${filename}.ts`

fs.writeFileSync(destFile, template.replace("Template", entityName))

if (process.env["VSCODE_GIT_ASKPASS_NODE"]) {
  spawn(process.env["VSCODE_GIT_ASKPASS_NODE"], [destFile], {})
}

import("./create-main.mjs")
import("./imports-injectable.mjs")
