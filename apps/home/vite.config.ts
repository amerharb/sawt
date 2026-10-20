import { defineConfig } from 'vite'
import type { Connect } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json'
import notices from './notice/languages.json'
import { fallback } from './notice/fallback.mjs'

// /privacy, and /privacy/<a language the notice is not written in>, go to
// /privacy/en, as vercel.json's redirects do on Vercel (notice/fallback.mjs)
const privacyFallback: Connect.NextHandleFunction = (req, res, next) => {
	const target = fallback(notices, (req.url ?? '').split('?')[0])
	if (target === null) return next()
	res.statusCode = 307
	res.setHeader('Location', target)
	res.end()
}

export default defineConfig({
	plugins: [
		react(),
		{
			name: 'privacy-fallback',
			configureServer: server => { server.middlewares.use(privacyFallback) },
			configurePreviewServer: server => { server.middlewares.use(privacyFallback) },
		},
	],
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
	server: {
		port: 3000,
	},
	// the landing page, and the privacy notice beside it in every language it
	// has, each at /privacy/<code> — English at /privacy/en — which Vercel
	// serves without .html (cleanUrls) and Vite's dev server does too. The
	// notice's pages are written by tools/privacy.mjs, from notice/
	build: {
		rollupOptions: {
			input: {
				index: 'index.html',
				...Object.fromEntries(notices.map(l => [`privacy-${l.code}`, `privacy/${l.code}.html`])),
			},
		},
	},
})
