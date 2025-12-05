export default [
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        window: true,
        document: true,
        console: true,
        setTimeout: true,
        clearTimeout: true,
        setInterval: true,
        clearInterval: true,
        localStorage: true,
        sessionStorage: true,
        fetch: true,
        geminiEnhancer: true,
        GEMINI_API_KEY: true,
        process: true,
        __dirname: true,
        __filename: true,
        exports: true,
        module: true,
        require: true,
        global: true,
        Buffer: true
      }
    },
    rules: {
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "no-unused-vars": ["warn"],
      "no-console": ["warn"],
      "eqeqeq": ["error", "always"],
      "no-var": ["error"],
      "prefer-const": ["error"],
      "no-multiple-empty-lines": ["error", { "max": 1 }],
      "no-trailing-spaces": ["error"],
      "comma-dangle": ["error", "never"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"]
    }
  }
];