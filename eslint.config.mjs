import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "react/no-unescaped-entities": "off", // Disable this rule
      "@typescript-eslint/no-explicit-any": "off", // Disable the 'any' type rule
      "@typescript-eslint/no-unused-vars": "off", // Disable unused vars rule
    },
  },
];

export default eslintConfig;
