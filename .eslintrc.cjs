module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    project: ["./tsconfig.json"],
  },
  plugins: ["react-refresh", "no-excess-property"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "no-excess-property/no-excess-property": [
      "error",
      {
        skipWords: [
          "ReactNode",
          "Element",
          "ReactElement",
          "ReactNodeArray",
          "ReactElementArray",
        ],
        skipProperties: [],
        checkJsx: true,
        checkClass: false,
      },
    ],
  },
};
