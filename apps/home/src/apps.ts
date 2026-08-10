/*
 * The apps this page links to. Each lives on its own subdomain, deployed
 * from its own folder in this workspace — see the root README.
 */
export type AppLink = {
	// the workspace folder name, and the subdomain
	slug: string,
	name: string,
	// what it teaches, in a few words
	teaches: string,
	// the app's own favicon, copied into public/icons/ so the button carries the
	// same mark as the app itself
	icon: string,
	// when true, only shown in development / beta builds — for an app whose
	// subdomain is not deployed yet, so production never links into a 404
	beta?: boolean,
}

export const APPS: AppLink[] = [
	{ slug: 'week', name: 'Week', teaches: 'the days of the week', icon: '/icons/week.svg' },
	{ slug: 'flags', name: 'Flags', teaches: 'country flags and names', icon: '/icons/flags.svg' },
	{ slug: 'colors', name: 'Colors', teaches: 'colours', icon: '/icons/colors.svg' },
	{ slug: 'numbers', name: 'Numbers', teaches: 'numbers 0–12', icon: '/icons/numbers.svg' },
	{ slug: 'anthem', name: 'Anthem', teaches: 'national anthems', icon: '/icons/anthem.svg' },
	{ slug: 'face', name: 'Face', teaches: 'feelings, from faces', icon: '/icons/face.svg', beta: true },
]

// week -> https://week.sawt.info
export const urlFor = (app: AppLink) => `https://${app.slug}.sawt.info`
