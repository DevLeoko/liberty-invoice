export function formatClientName(
	client: {
		name: string
		firstName: string
		lastName: string
	},
	preferFullName = false
) {
	const fullName = `${client.firstName} ${client.lastName}`.trim()

	if (preferFullName && fullName) {
		return fullName
	}

	return client.name || fullName
}
