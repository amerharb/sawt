import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json'
import notices from './notice/languages.json'

export default defineConfig({
	plugins: [react()],
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
	server: {
		port: 3000,
	},
	// the landing page, and the privacy notice beside it in every language it
	// has — English at /privacy, the others at /privacy/<code> — which Vercel
	// serves without .html (cleanUrls) and Vite's dev server does too. The
	// notice's pages are written by tools/privacy.mjs, from notice/
	build: {
		rollupOptions: {
			input: {
				index: 'index.html',
				...Object.fromEntries(notices.map((l, i) => (i === 0
					? ['privacy', 'privacy.html']
					: [`privacy-${l.code}`, `privacy/${l.code}.html`]))),
			},
		},
	},
})
