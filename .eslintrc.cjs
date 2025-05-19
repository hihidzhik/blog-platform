module.exports = {
  settings: {
    react: {
      version: "detect",
    },
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      alias: {
        map: [["@", "./src"]],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ["node_modules", "dist", "build", "README", "vite.config.js"],
  extends: [
    "eslint:recommended",
    "airbnb",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:jsx-a11y/recommended",
    "eslint-config-prettier",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "import", "jsx-a11y"],
  rules: {
    "no-console": "off",
    indent: ["error", 2],
    "linebreak-style": [0, "unix"],
    quotes: ["error", "single"],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
      },
    ],
    "import/no-unresolved": [2, { caseSensitive: false }],
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "jsx-a11y/label-has-associated-control": [
      "error",
      {
        controlComponents: ["Input"],
      },
    ],
    "import/prefer-default-export": "off",
    "no-param-reassign": [
      "error",
      { props: true, ignorePropertyModificationsFor: ["state"] },
    ],
    "react/no-array-index-key": "warn",
    "react/jsx-props-no-spreading": "off",
    "jsx-a11y/click-events-have-key-events": "error",
    "jsx-a11y/no-noninteractive-element-interactions": "error",
    "jsx-a11y/no-static-element-interactions": "error",
  },
};
