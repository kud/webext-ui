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

// The invariant is about declarations, not prose — a comment explaining the
// rule must not trip it.
const withoutComments = (css: string): string =>
  css.replace(/\/\*[\s\S]*?\*\//g, "")

describe("shipped css", () => {
  it.each(cssFiles)("%s references no external asset", (file) => {
    expect(withoutComments(readDistCss(file))).not.toMatch(/url\(/)
  })

  it.each(cssFiles)("%s carries the current version in its header", (file) => {
    expect(readDistCss(file)).toContain(`v${readPackageVersion()}`)
  })

  // A stamping failure is the real risk: it ships a file whose version cannot
  // be grepped, which is the entire point of the stamp.
  it.each(cssFiles)("%s has no unstamped placeholder left", (file) => {
    expect(readDistCss(file)).not.toContain("@VERSION@")
  })

  // The source must keep the placeholder — hardcoding a version there would
  // pass every check above while silently freezing the stamp.
  it.each(cssFiles)("%s source still carries the placeholder", (file) => {
    const source = readFileSync(join(process.cwd(), "src", "css", file), "utf8")
    expect(source).toContain("@VERSION@")
  })
})
