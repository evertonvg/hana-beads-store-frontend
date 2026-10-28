import load from "@commitlint/load";
import lint from "@commitlint/lint";
import { check, resolveConfig } from "prettier";
import { describe, expect, it } from "vitest";

type LintOptions = NonNullable<Parameters<typeof lint>[2]>;

const prettierFile = resolve("app/example.tsx");

function resolve(path: string) {
  return new URL(`../../${path}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
}

describe("commitlint", () => {
  const lintMessage = async (message: string) => {
    const { rules, parserPreset } = await load({}, { cwd: resolve("") });
    const parserOpts = parserPreset?.parserOpts as LintOptions["parserOpts"];
    return lint(message, rules, { parserOpts });
  };

  it.each(["ajustes", "Feat: X"])("rejects %j", async (message) => {
    const result = await lintMessage(message);
    expect(result.valid).toBe(false);
  });

  it("accepts a conventional commit", async () => {
    const result = await lintMessage("feat(cart): add undo");
    expect(result.valid).toBe(true);
    expect(result.warnings).toEqual([]);
  });
});

describe("prettier", () => {
  const isFormatted = async (source: string) => {
    const options = await resolveConfig(prettierFile);
    return check(source, { ...options, filepath: prettierFile });
  };

  it("flags Tailwind classes that are out of order", async () => {
    expect(await isFormatted('<div className="p-4 flex" />;\n')).toBe(false);
  });

  it("accepts Tailwind classes in canonical order", async () => {
    expect(await isFormatted('<div className="flex p-4" />;\n')).toBe(true);
  });
});
