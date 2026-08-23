/*
 * One ESLint config for every app in the workspace.
 *
 * Two jobs, in priority order:
 *
 *   1. Catch real mistakes — unused code, misused hooks, unsafe TypeScript.
 *   2. Hold the existing house style: tabs, single quotes, no semicolons.
 *      These rules describe what the code already does, so they lock the style
 *      in rather than reformatting anything.
 *
 * Deliberately NOT type-aware (no `projectService`). Type-aware linting needs a
 * tsconfig per app and is far slower; `npm run typecheck` already runs `tsc`
 * across every app, so the type errors are caught there.
 */
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default tseslint.config(
	{
		// build output and vendored code are not ours to lint
		ignores: [
			'**/dist/**',
			'**/node_modules/**',
			'**/coverage/**',
			'**/*.d.ts',
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['apps/*/src/**/*.{ts,tsx}', 'packages/*/src/**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2022,
			globals: {
				...globals.browser,
				// injected by vite.config.ts from package.json
				__APP_VERSION__: 'readonly',
			},
		},
		plugins: {
			'react-hooks': reactHooks,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			// Known debt, kept visible as warnings rather than errors: the apps
			// deliberately set state inside their settings-load and cache-count
			// effects (the pattern every app shares). CI caps total warnings at
			// the current count — a NEW finding of any kind still fails the build.
			'react-hooks/set-state-in-effect': 'warn',

			// --- house style, matching what the code already does -----------
			indent: ['error', 'tab', { SwitchCase: 1 }],
			quotes: ['error', 'single', { avoidEscape: true }],
			semi: ['error', 'never'],
			'comma-dangle': ['error', 'always-multiline'],
			'eol-last': ['error', 'always'],
			'no-trailing-spaces': 'error',
			'object-curly-spacing': ['error', 'always'],

			// --- correctness ------------------------------------------------
			// an unused variable is usually a leftover; an unused argument
			// prefixed with _ is a deliberate placeholder
			'@typescript-eslint/no-unused-vars': ['error', {
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			}],
			eqeqeq: ['error', 'always', { null: 'ignore' }],
			'no-var': 'error',
			'prefer-const': 'error',
		},
	},
	{
		// config files run in Node, not the browser
		files: ['**/*.config.{ts,js}', 'eslint.config.js'],
		languageOptions: {
			globals: globals.node,
		},
	},
)
