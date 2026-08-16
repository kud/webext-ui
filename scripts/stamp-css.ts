import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const cssFiles = ["tokens.css", "webext-ui.css"]

const readPackageVersion = (): string => {
  const packageJsonPath = join(projectRoot, "package.json")
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"))
  return packageJson.version
}

const stampFile = (file: string, version: string): void => {
  const source = readFileSync(join(projectRoot, "src", "css", file), "utf8")
  const stamped = source.replaceAll("@VERSION@", version)
  writeFileSync(join(projectRoot, "dist", file), stamped)
}

const run = (): void => {
  const version = readPackageVersion()
  mkdirSync(join(projectRoot, "dist"), { recursive: true })
  for (const file of cssFiles) {
    stampFile(file, version)
  }
}

run()
