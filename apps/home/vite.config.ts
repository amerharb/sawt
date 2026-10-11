import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json'

export default defineConfig({
	plugins: [react()],
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
	server: {
		port: 3000,
	},
	// two pages: the landing page, and the privacy notice beside it, which
	// Vercel serves at /privacy (cleanUrls) and Vite's dev server does too
	build: {
		rollupOptions: {
			input: {
				index: 'index.html',
				privacy: 'privacy.html',
			},
		},
	},
})
