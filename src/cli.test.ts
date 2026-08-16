import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const cliPath = join(process.cwd(), "dist", "cli.js")

const runSync = (targetDir: string): void => {
  execFileSync("node", [cliPath, "sync", targetDir], { stdio: "pipe" })
}

const readCssPair = (targetDir: string): [Buffer, Buffer] => [
  readFileSync(join(targetDir, "tokens.css")),
  readFileSync(join(targetDir, "webext-ui.css")),
]

describe("sync", () => {
  it("creates the target dir (including missing parents) and copies both css files", () => {
    const base = mkdtempSync(join(tmpdir(), "webext-ui-"))
    const target = join(base, "nested", "vendor")

    runSync(target)

    const [tokens, webextUi] = readCssPair(target)
    expect(tokens.toString("utf8")).toContain("webext-ui")
    expect(webextUi.length).toBeGreaterThan(0)
  })

  it("is idempotent — running twice leaves identical bytes", () => {
    const base = mkdtempSync(join(tmpdir(), "webext-ui-"))
    const target = join(base, "vendor")

    runSync(target)
    const first = readCssPair(target)
    runSync(target)
    const second = readCssPair(target)

    expect(first[0].equals(second[0])).toBe(true)
    expect(first[1].equals(second[1])).toBe(true)
  })
})
