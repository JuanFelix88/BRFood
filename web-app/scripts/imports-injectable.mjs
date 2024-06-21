import fs from "node:fs"

const locals = [
  `${process.cwd()}/core/application/usecases`,
  `${process.cwd()}/core/infra/database/postgres/repositories`,
]

createIndexImports(`${process.cwd()}/core`)

function createIndexImports(dir = "") {
  const items = fs.readdirSync(dir).filter((f) => f !== "index.ts")

  const output = []
  for (const item of items) {
    if (fs.statSync(`${dir}/${item}`).isDirectory()) {
      createIndexImports(`${dir}/${item}`)
    } else if (item.endsWith(".ts")) {
      output.push(item)
    }
  }

  if (output.length > 1) {
    fs.writeFileSync(
      `${dir}/index.ts`,
      output
        .map((file) => `export * from "./${file.replace(".ts", "")}"`)
        .join("\n") + "\n",
    )
  }
}

// for (const local of locals) {
//   const dir = fs.readdirSync(local).filter((f) => f !== "index.ts")

//   fs.writeFileSync(
//     `${local}/index.ts`,
//     dir
//       .map((file) => `export * from "./${file.replace(".ts", "")}"`)
//       .join("\n"),
//   )
// }
