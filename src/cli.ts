import { copyFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const CSS_FILES = ["tokens.css", "webext-ui.css"]

const packageRoot = dirname(fileURLToPath(import.meta.url))

const printUsage = (): void => {
  console.error("Usage: webext-ui sync <target-dir>")
}

const syncCommand = (targetDir: string): void => {
  mkdirSync(targetDir, { recursive: true })
  for (const file of CSS_FILES) {
    copyFileSync(join(packageRoot, file), join(targetDir, file))
  }
  console.log(`Synced ${CSS_FILES.join(", ")} to ${targetDir}`)
}

const run = (): void => {
  const [command, targetDir] = process.argv.slice(2)

  if (command !== "sync" || !targetDir) {
    printUsage()
    process.exitCode = 1
    return
  }

  syncCommand(targetDir)
}

run()
