/// <reference types="vite/client" />

interface ImportMetaEnv {
	// Set VITE_SHOW_BETA=true to reveal beta items in a build.
	readonly VITE_SHOW_BETA?: string
	// Set VITE_SADA_ENABLED=true to allow sending game data to sada — see sada.ts.
	readonly VITE_SADA_ENABLED?: string
	// The sada collector's base URL, e.g. https://sada.sawt.info
	readonly VITE_SADA_URL?: string
	// Set VITE_SAHA_ENABLED=true to offer multiplayer rooms — see saha.ts.
	readonly VITE_SAHA_ENABLED?: string
	// The saha courtyard's base URL, e.g. https://saha.sawt.info
	readonly VITE_SAHA_URL?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
