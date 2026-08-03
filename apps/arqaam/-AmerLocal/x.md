import React, {useState} from 'react'
import './App.css'
import {useCallback} from 'react'
import {Analytics} from '@vercel/analytics/react'



function App() {
type Lang = { code: string, display: string, flag?: string }
const langList: Lang[] = [
{code: 'ar', display: 'Arabic', flag: '🇵🇸'},
{code: 'en', display: 'English', flag: '🇬🇧'},
{code: 'de', display: 'German', flag: '🇩🇪'},
{code: 'sv', display: 'Swedish', flag: '🇸🇪'},
// TODO: Add more languages later
// {code: 'fr', display: 'French', flag: '🇫🇷'},
// {code: 'tr', display: 'Turkish', flag: '🇹🇷'},
// {code: 'fa', display: 'Farsi', flag: '🇮🇷'},
// {code: 'fi', display: 'Finnish', flag: '🇫🇮'},
// {code: 'ru', display: 'Russian', flag: '🇷🇺'},
// {code: 'zh', display: 'Chinese', flag: '🇨🇳'},
// {code: 'es', display: 'Spanish', flag: '🇪🇸'},
]
const [lang, setSelectedLanguage] = useState(langList[0])

	const handleLanguageChange = (lang: Lang) => {
		setSelectedLanguage(lang)
	}

	const playSound = useCallback(async (langCode: string, n: number) => {
		// const audio = new Audio(`/sounds/${langCode}/${n}.aac`);
		try {
			const audioUrl = `/sounds/${langCode}/${n}.aac`
			let response = await getAudio(audioUrl)

			const blob = await response.blob()
			const objectUrl = URL.createObjectURL(blob)
			const audio = new Audio(objectUrl)
			await audio.play()
		} catch (e) {
			console.error(e)
		}
	}, [])

	return (
		<div className="Arqam">
			<h1>Arqaam Web</h1>
			<hgroup>
				{langList.map((l) => (
					<button
						key={`lang-${l.code}`}
						className={l.code === lang.code ? 'down' : 'up'}
						onClick={() => handleLanguageChange(l)}
					>
						{l.flag}
					</button>
				))}
			</hgroup>
			<div>
				{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
					<button
						key={`number-${n}`}
						className="button-number"
						onClick={() => playSound(lang.code, n)}
					>
						{n}
					</button>
				))}
			</div>
			<Analytics/>
		</div>
	)
}

async function getAudio(audioUrl: string) {
const TTL = 60 * 1000 // 1 minute
const cacheTimestamp = 'Cache-Timestamp'
if ('caches' in window) {
const cache = await caches.open('audio-cache')
const cachedResponse = await cache.match(audioUrl)

		if (cachedResponse) {
			// Get the timestamp when the response was cached
			const headerTimestamp = getTimestamp(cachedResponse.headers.get(cacheTimestamp))
			if (isNaN(headerTimestamp) || Date.now() - headerTimestamp > TTL) {
				await cache.delete(audioUrl)
			} else {
				return cachedResponse
			}
		}

		const response = await fetch(audioUrl)
		// Add a date header to the response before caching it
		response.headers.append(cacheTimestamp, Date.now().toString())
		await cache.put(audioUrl, response.clone())
		return response
	} else {
		return await fetch(audioUrl)
	}
}

function getTimestamp(value: string | null): number {
if (value === null) return NaN
return Number.parseInt(value)
}

export default App

♪ (U+266A) — eighth note
♫ (U+266B) — beamed eighth notes
♬ (U+266C) — beamed sixteenth notes
🎵 (U+1F3B5) — musical notes
🎶 (U+1F3B6) — musical notes flowing