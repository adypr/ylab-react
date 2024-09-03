import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
              js.configs.recommended,
              ...tseslint.configs.recommended,
              'eslint:recommended',
              'plugin:react/recommended',
              'plugin:prettier/recommended',
            ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'prettier': prettier
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      "no-restricted-syntax": [
        "error",
        {
          "selector": "CallExpression[callee.object.name='document'][callee.property.name=/querySelector|getElementById|getElementsByClassName|getElementsByTagName/]",
          "message": "Direct DOM manipulation is not allowed. Use React refs or state instead.",
          "except": ["CallExpression[callee.object.name='document'][callee.property.name='getElementById'][arguments.0.value='root']"]
        }
      ],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        'prettier/prettier': 'error',
    },
  },
)
