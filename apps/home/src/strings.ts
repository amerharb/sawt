/*
 * The landing page's words. One language — the page has no interface
 * language setting — so `t` is a lookup into one dictionary, under the same
 * keys the apps will carry in their i18n/<lang>.json when the sign-in sheet
 * reaches them. A key with no entry comes back as itself, which is how a
 * missing string shows in development rather than hiding.
 */
const STRINGS: Record<string, string> = {
	// the control, top right of the page
	'baab.open': 'Sign in',
	'baab.signedInAs': 'Signed in as',

	// the sheet
	'baab.title': 'Sign in',
	'baab.close': 'Close',
	'baab.asking': 'One moment…',

	// step one: the email
	'baab.lead': 'Keep your nickname and settings on every device.',
	'baab.email': 'A grown-up’s email',
	'baab.emailNote': 'We mail a six-digit code and a link. Only a keyed hash of the address is kept, never the address itself.',
	'baab.stay': 'You stay signed in on this device for 180 days, or until you sign out.',
	'baab.send': 'Send me a code',

	// step two: the code
	'baab.sentTo': 'We sent a code to',
	'baab.code': 'The six digits',
	'baab.codeNote': 'Or open the link in the mail: it brings you back here, signed in. The code works for ten minutes.',
	'baab.enter': 'Enter',
	'baab.again': 'Send again',
	'baab.another': 'Another email',

	// what the door said
	'baab.wait': 'A code went out less than a minute ago. Use that one, or wait a little and ask again.',
	'baab.refused': 'That does not look like an email address.',
	'baab.wrong': 'That code is not right, or it has run out. Ask for a new one.',
	'baab.linkWrong': 'That link has run out or was already used. Ask for a new code.',
	'baab.down': 'Sign-in is not answering right now. Try again in a moment.',
	'baab.arrived': 'Signed in from the link.',

	// inside
	'baab.handle': 'Your handle',
	'baab.handleNote': 'Yours for good, and the name the apps know you by.',
	'baab.nickname': 'Nickname',
	'baab.nicknameNote': 'Decoration only, up to 24 characters.',
	'baab.save': 'Save',
	'baab.saved': 'Saved.',
	'baab.leave': 'Sign out',
}

export const t = (key: string): string => STRINGS[key] ?? key
