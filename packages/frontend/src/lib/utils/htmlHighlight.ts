export function htmlHighlight(text: string, highlight: string) {
	// Prevent XSS | TODO: might need to be improved (for now only used for user's own data)
	text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;')

	const regex = new RegExp(highlight, 'gi')
	return text.replace(regex, (match) => `<b>${match}</b>`)
}
