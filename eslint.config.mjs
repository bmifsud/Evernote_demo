import playwright from "eslint-plugin-playwright";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["node_modules", "dist", "playwright-report"]
  },
  ...tseslint.configs.recommended,
  playwright.configs["flat/recommended"],
  {
    files: ["src/**/*.ts", "tests/**/*.ts", "*.ts"],
    rules: {
      "playwright/no-focused-test": "error",
      "playwright/no-skipped-test": "warn",
      "playwright/expect-expect": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "playwright/no-networkidle": "off",
      "playwright/no-wait-for-timeout": "off"
    }
  }
);
