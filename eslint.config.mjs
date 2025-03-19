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
    ignores: [
      "src/components/ui/datetime-input.tsx",
      "src/components/ui/datetime-picker.tsx",
      "src/components/ui/simple-time-picker.tsx",
    ],
  },
];

export default eslintConfig;