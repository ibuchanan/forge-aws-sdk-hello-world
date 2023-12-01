module.exports = {
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": ["*.ts", "*.tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module",
    ecmaVersion: 2017,
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react-hooks"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
  },
};
