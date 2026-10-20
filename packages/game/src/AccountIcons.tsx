/*
 * The account's line icons: an arrow going into an open box, one coming out
 * of it, and the profile as a person in a circle. Tabler's outline `login`,
 * `logout` and `user-circle`, MIT licensed (© 2020-2024 Paweł Kuna,
 * tabler.io/icons), drawn in the text's own colour so they follow the
 * theme, and sized by the font size. One set for ⚙️'s 👤 (AccountSetting)
 * and the landing page's sign-in control, so the two draw the same marks.
 */
const glyph = (paths: string[]) => function Glyph() {
	return (
		<svg
			className="account-glyph"
			viewBox="0 0 24 24"
			width="1em"
			height="1em"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			focusable="false"
		>
			{paths.map(d => <path key={d} d={d}/>)}
		</svg>
	)
}

export const SignInIcon = glyph([
	'M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2',
	'M21 12h-13l3 -3',
	'M11 15l-3 -3',
])

// the profile baab keeps, opened in the sheet
export const ProfileIcon = glyph([
	'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0',
	'M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
	'M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855',
])

export const SignOutIcon = glyph([
	'M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2',
	'M9 12h12l-3 -3',
	'M18 15l3 -3',
])
