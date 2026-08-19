import { APPS, urlFor } from './apps'
import { Analytics } from '@vercel/analytics/react'
import { isVisible } from '@sawt/feature-flags'


function App() {
	return (
		<div className="page">
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
			<Analytics/>
		</div>
	)
}

export default App
