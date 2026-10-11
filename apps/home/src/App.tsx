import { useState } from 'react'
import { APPS, urlFor } from './apps'
import { Analytics } from '@vercel/analytics/react'
import { isVisible, SHOW_BETA } from '@sawt/feature-flags'
import { BAAB, useBaab, BaabSheet } from '@sawt/game'
import { t } from './strings'


function App() {
	/*
	 * baab: sign in here and every app under sawt.info is signed in too,
	 * the session being one cookie for the whole domain. Beta-gated for now,
	 * so a production build neither draws the control nor asks baab
	 * anything until the gate opens; dev and VITE_SHOW_BETA builds do both.
	 */
	const baab = useBaab('home', SHOW_BETA)
	const [sheetOpen, setSheetOpen] = useState(false)
	// a magic link opens the sheet by itself, to say how it went
	const open = sheetOpen || baab.arrival !== null
	const close = () => {
		setSheetOpen(false)
		baab.settle()
	}
	const { session } = baab
	// nothing is drawn until baab has answered once — not a "Sign in"
	// that turns into a name a beat later
	const signInShown = SHOW_BETA && BAAB.enabled && session.state !== 'unknown'
	const name = session.state === 'in' ? (session.profile.nickname ?? session.profile.handle) : null

	return (
		<div className="page">
			{signInShown && (
				<button
					type="button"
					className={name ? 'baab-open in' : 'baab-open'}
					aria-haspopup="dialog"
					aria-expanded={open}
					aria-label={name ? `${t('baab.signedInAs')} ${name}` : undefined}
					title={name ? `${t('baab.signedInAs')} ${name}` : undefined}
					onClick={() => setSheetOpen(true)}
				>
					{name ?? t('baab.open')}
				</button>
			)}

			<header className="masthead">
				<h1>
					<span className="wordmark">sawt</span>
					<span className="native" lang="ar" dir="rtl">صوت</span>
				</h1>
				<p className="tagline">
					Point at a thing, hear its name in the language you&rsquo;re learning,
					then guess it by ear.
				</p>
			</header>

			<nav className="apps" aria-label="The apps">
				{APPS.filter(isVisible).map(app => (
					<a className="app" key={app.slug} href={urlFor(app)}>
						<img className="app__icon" src={app.icon} alt="" width="64" height="64"/>
						<span className="app__name">{app.name}</span>
						<span className="app__teaches">{app.teaches}</span>
					</a>
				))}
			</nav>

			<footer className="foot">
				<a href="https://github.com/amerharb/sawt">Source on GitHub</a>
				<span aria-hidden="true">·</span>
				<a href="https://amerharb.com">amerharb.com</a>
				<span aria-hidden="true">·</span>
				{/* the repository version, injected at build time from package.json */}
				<span className="version" title="Version">v{__APP_VERSION__}</span>
			</footer>

			{open && <BaabSheet t={t} dir="ltr" baab={baab} onClose={close}/>}
			<Analytics/>
		</div>
	)
}

export default App
