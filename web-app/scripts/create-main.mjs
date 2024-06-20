import * as changecase from "change-case"
import { spawn } from "node:child_process"
import path from "node:path"
import fs from "node:fs"

const relativeUsecasesDir = "src/application/usecases"
const usecasesDir = `${process.cwd()}/${relativeUsecasesDir}`

const usecases = fs
  .readdirSync(usecasesDir)
  .filter((f) => f !== "index.ts")
  .map((f) => f.replace(".ts", ""))
const mainFile = "./src/infra/main/main.ts"

const main = fs.readFileSync(mainFile, "utf-8")

const withoutImports = main
  .replace(
    /class Main {(\n|.)*}/,
    `class Main {
  constructor(
${usecases
    .map(
      (file) =>
        `    public readonly ${changecase.camelCase(file)}: ${changecase.pascalCase(file)}`,
    )
    .join(",\n")}
  ) {}
}`,
  )
  .split(/\n|\r/)
  .filter((l) =>
    l.includes("usecases") && l.startsWith("import") ? false : true,
  )
  .join("\n")

const importss = usecases
  .map(
    (usecase) =>
      `import { ${changecase.pascalCase(usecase)} } from "@/${relativeUsecasesDir.replace("./", "").replace("..\\", "")}/${usecase}"`,
  )
  .join("\n")

const out = importss + "\n" + withoutImports

fs.writeFileSync(mainFile, out)
