import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const cssFiles = ["tokens.css", "webext-ui.css"]

const readPackageVersion = (): string => {
  const packageJsonPath = join(process.cwd(), "package.json")
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"))
  return packageJson.version
}

const readDistCss = (file: string): string =>
  readFileSync(join(process.cwd(), "dist", file), "utf8")

describe("shipped css", () => {
  it.each(cssFiles)("%s contains no url()", (file) => {
    expect(readDistCss(file)).not.toMatch(/url\(/)
  })

  it.each(cssFiles)(
    "%s is stamped with the current package version",
    (file) => {
      const version = readPackageVersion()
      expect(readDistCss(file)).toContain(version)
    },
  )
})
